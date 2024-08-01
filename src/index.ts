import { Server } from 'http';
import app from './app';
const port = process.env.PORT ||8000

async function main (){
  const  server: Server = app.listen(port, ()=>{
        console.log("App is running at" , port);
    })
}

main()