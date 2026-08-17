-- Usuario admin inicial (contraseña: admin123)
-- password_hash generado con bcrypt.hashSync('admin123', 10)
INSERT INTO usuarios_oti (correo, password_hash)
VALUES ('admin@oti.unap.edu.pe', '$2b$10$mVqXzMY/KA8oqgrbyFniTe6JBTMctqvg4ncvJI72TyQ6TW.nsP0.S')
ON CONFLICT (correo) DO NOTHING;
