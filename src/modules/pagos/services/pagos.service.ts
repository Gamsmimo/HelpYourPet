import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from '../entities/pago.entity';
import { CreatePagoDto } from '../dto/create-pago.dto';
import { UpdatePagoDto } from '../dto/update-pago.dto';
import { CreateStripeCheckoutDto } from '../dto/create-stripe-checkout.dto';
import Stripe from 'stripe';

@Injectable()
export class PagosService {
  private readonly stripe: any;

  constructor(
    @InjectRepository(Pago)
    private pagosRepository: Repository<Pago>,
  ) {
    const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
    const stripeKeyLooksValid =
      (stripeSecretKey.startsWith('sk_test_') || stripeSecretKey.startsWith('sk_live_')) &&
      !stripeSecretKey.toLowerCase().includes('reemplaza') &&
      !stripeSecretKey.toLowerCase().includes('xxxxx');

    this.stripe = stripeSecretKey
      && stripeKeyLooksValid
      ? new Stripe(stripeSecretKey)
      : null;
  }

  async create(createPagoDto: CreatePagoDto): Promise<Pago> {
    const pago = this.pagosRepository.create(createPagoDto);
    return this.pagosRepository.save(pago);
  }

  async findAll(): Promise<Pago[]> {
    return this.pagosRepository.find({ relations: ['venta'] });
  }

  async findByVenta(idVenta: number): Promise<Pago[]> {
    return this.pagosRepository.find({
      where: { idVenta },
      relations: ['venta'],
    });
  }

  async findOne(id: number): Promise<Pago> {
    const pago = await this.pagosRepository.findOne({
      where: { id },
      relations: ['venta'],
    });
    if (!pago) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }
    return pago;
  }

  async update(id: number, updatePagoDto: UpdatePagoDto): Promise<Pago> {
    const pago = await this.findOne(id);
    Object.assign(pago, updatePagoDto);
    return this.pagosRepository.save(pago);
  }

  async remove(id: number): Promise<void> {
    const pago = await this.findOne(id);
    await this.pagosRepository.remove(pago);
  }

  async createStripeCheckoutSession(dto: CreateStripeCheckoutDto): Promise<{ url: string; sessionId: string }> {
    if (!this.stripe) {
      throw new BadRequestException(
        'Stripe no estÃ¡ configurado correctamente. Define una STRIPE_SECRET_KEY vÃ¡lida (sk_test_...) y reinicia el backend.',
      );
    }

    if (!dto.items?.length) {
      throw new BadRequestException('Debes enviar al menos un producto para pagar.');
    }

    const currency = (dto.currency || 'cop').toLowerCase();
    const successUrl = dto.successUrl || 'http://localhost:4200/tienda?payment=success';
    const cancelUrl = dto.cancelUrl || 'http://localhost:4200/tienda?payment=cancel';

    const lineItems = dto.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price,
      },
    }));

    let session: any;
    try {
      session = await this.stripe.checkout.sessions.create({
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        line_items: lineItems,
        payment_method_types: ['card'],
      });
    } catch (error: any) {
      throw new BadRequestException(
        `Stripe rechazÃ³ la sesiÃ³n de pago: ${error?.message || 'Error desconocido'}`,
      );
    }

    if (!session.url) {
      throw new InternalServerErrorException('No se pudo generar la URL de pago de Stripe.');
    }

    return {
      url: session.url,
      sessionId: session.id,
    };
  }
}

