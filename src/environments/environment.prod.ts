export const environment = {
  production: true,
  urlIndex: 'https://dev-crm.elpahuichi.com.bo/index.php',
  urlApi: 'https://dev-crm.elpahuichi.com.bo/Api/V8/module',
  auth: {
    url: 'https://dev-crm.elpahuichi.com.bo/Api/access_token',
    credential: {
      grant_type: 'client_credentials',
      client_id: 'd32c7a2b-2a63-7bbd-73f8-611b882be95c',
      client_secret: 'crm2021',
    }
  },
  etapas: ['CAPTADO', 'INTERES', 'NEGOCIACION', 'PROPUESTA_GANADA', 'RESERVA', 'CONTRATO', 'CIERRE_GANADO', 'CIERRE_PERDIDO'],
  status: ['Assigned','Converted','Recycled','Dead']
};
