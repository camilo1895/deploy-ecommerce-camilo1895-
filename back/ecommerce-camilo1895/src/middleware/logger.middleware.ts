import { NextFunction, Request, Response } from 'express';

export function LoggerGlobal(req: Request, res: Response, next: NextFunction) {
  const fecha = new Date();
  console.log(
    `Se ejecuto un metodo ${req.method} en la ruta ${req.url}, a la fecha y hora: ${fecha.toLocaleString()}`,
  );

  next();
}
