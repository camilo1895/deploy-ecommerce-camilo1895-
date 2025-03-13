import { NextFunction, Request, Response } from 'express';

export function LoggerGlobal(req: Request, res: Response, next: NextFunction) {
  const fechaActual = new Date();
  const horaFecha = fechaActual.toLocaleDateString();
  const hora = fechaActual.toLocaleTimeString();
  console.log(
    `A las ${hora} del ${horaFecha} se ejecuto un metodo ${req.method} en la ruta ${req.url}`,
  );
  next();
}
