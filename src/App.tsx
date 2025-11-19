import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'


// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    user: {
      name: "Optik Gembera",
      email: "example@gmail.com",
      avatar: "OG",
    }  
  }
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
    context: {
      user: {
         name: string
         email: string
         avatar: string
      }
    }
  }
}



function App(){
  return <RouterProvider router={router} /> 
}

export default App;

