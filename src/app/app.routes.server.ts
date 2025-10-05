import { RenderMode, ServerRoute } from '@angular/ssr';


export const serverRoutes: ServerRoute[] = [

  {
    path: 'checkout/:cartId',
    renderMode: RenderMode.Client,
  },
  {
    path: 'order-confirmation/:id',
    renderMode: RenderMode.Client,
  },
  // {
  //   path: 'orderConfirmation/*',
  //   renderMode: RenderMode.Client,
  // },
  {
    path: 'checkout/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'single/:pid/:pName',
    renderMode: RenderMode.Client,
  },
  
  {
   path: '**',
    renderMode:  RenderMode.Prerender
  
  },

];