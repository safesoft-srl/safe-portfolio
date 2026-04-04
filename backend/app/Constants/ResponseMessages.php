<?php

namespace App\Constants;

class ResponseMessages
{
    /*
    |--------------------------------------------------------------------------
    | Success Messages
    |--------------------------------------------------------------------------
    */

    public const CREATED_SUCCESSFULLY = 'Recurso creado exitosamente.';

    public const UPDATED_SUCCESSFULLY = 'Recurso actualizado exitosamente.';

    public const DELETED_SUCCESSFULLY = 'Recurso eliminado exitosamente.';

    public const FETCHED_SUCCESSFULLY = 'Recurso obtenido exitosamente.';

    public const LIST_FETCHED_SUCCESSFULLY = 'Recursos obtenidos exitosamente.';

    public const OPERATION_SUCCESSFUL = 'Operación completada exitosamente.';

    /*
    |--------------------------------------------------------------------------
    | Authentication Messages
    |--------------------------------------------------------------------------
    */

    public const LOGIN_SUCCESSFUL = 'Inicio de sesión exitoso.';

    public const LOGOUT_SUCCESSFUL = 'Cierre de sesión exitoso.';

    public const REGISTER_SUCCESSFUL = 'Registro exitoso.';

    public const UNAUTHORIZED = 'Acceso no autorizado.';

    public const INVALID_CREDENTIALS = 'Credenciales inválidas.';

    public const TOKEN_GENERATED = 'Token generado exitosamente.';

    /*
    |--------------------------------------------------------------------------
    | Validation / Client Errors
    |--------------------------------------------------------------------------
    */

    public const VALIDATION_ERROR = 'La validación falló.';

    public const BAD_REQUEST = 'Solicitud incorrecta.';

    public const RESOURCE_NOT_FOUND = 'Recurso no encontrado.';

    public const DUPLICATE_RESOURCE = 'El recurso ya existe.';

    public const INVALID_DATA = 'Datos inválidos proporcionados.';

    /*
    |--------------------------------------------------------------------------
    | Server Errors
    |--------------------------------------------------------------------------
    */

    public const INTERNAL_SERVER_ERROR = 'Error interno del servidor.';

    public const SERVICE_UNAVAILABLE = 'Servicio no disponible.';

    public const DATABASE_ERROR = 'Error en la operación de la base de datos.';

    public const UNKNOWN_ERROR = 'Ocurrió un error inesperado.';
}
