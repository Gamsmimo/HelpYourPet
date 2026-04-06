import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';

@Controller()
export class ViewsController {
  @Get()
  home(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'src', 'public', 'index.html'));
  }

  @Get('login')
  login(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'src', 'public', 'login.html'));
  }

  @Get('register')
  register(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'src', 'public', 'register.html'));
  }

  @Get('admin')
  admin(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'src', 'public', 'admin.html'));
  }

  @Get('veterinario')
  veterinario(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'src', 'public', 'veterinario.html'));
  }

  @Get('usuario')
  usuario(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'src', 'public', 'usuario.html'));
  }

  @Get('adopcion')
  adopcion(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'src', 'public', 'adopcion.html'));
  }

  @Get('tienda')
  tienda(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'src', 'public', 'tienda.html'));
  }

  @Get('servicios')
  servicios(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'src', 'public', 'servicios.html'));
  }

  @Get('perfil')
  perfil(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'src', 'public', 'perfil.html'));
  }
}
