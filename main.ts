import {app, BrowserWindow, Menu, ipcMain, IpcMessageEvent, Accelerator} from "electron";
import * as fs from "fs";

let window:BrowserWindow = null;

const mainMenu = Menu.buildFromTemplate(
[ process.platform === "darwin" ? {label: app.getName()} : null ,
{
    label:"Archivo",
    submenu:[
        {
            label: "Añadir",
            accelerator: process.platform === "darwin" ? "Command+N" : "Ctrl+N",
            click(){
                if(fileExists){
                    window.webContents.send("add");
                }else{
                    window.webContents.send("noFile");
                }
            }
        },
        {
            label: "Editar"
        },
        {
            label: "Eliminar"
        },
        {
            label: "Salir",
            accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
            click(){
                app.quit();
            }
        },
        {
            label: "Cerrar pestaña",
            accelerator: process.platform === "darwin" ? "Command+W" : "Ctrl+W",
            role: "close"
        }
    ]
},
{
    label: "Ventas",
    submenu:[]
},
{
    label: "Base de datos",
    submenu:[]
},
{
    label: "Cotizaciones",
    submenu:[]
},
{
    label: "Compras",
    submenu:[]
},
{
    label: "Clientes",
    submenu:[]
},
{
    label: "Facturas",
    submenu:[]
}
]);

let fileExists:Boolean = false;

const createWindow = () =>{
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            nodeIntegration: true
        }
    });
    window.loadFile("renderer.html");
    window.webContents.openDevTools();
    window.on("closed", () =>{
        app.quit();
    });
    Menu.setApplicationMenu(mainMenu);
}

app.on("ready", createWindow);
app.on("window-all-closed", () =>{
   if(process.platform !== "darwin"){
       app.quit();
   } 
});

app.on("activate", () =>{
    if(window === null){
        createWindow();
    }
});

ipcMain.on("fileDropped", (e, path:string)=>{
    const extension = path.split(".")[1];
    if(extension === "json"){
        const data = fs.readFileSync(path,"utf-8");
        window.webContents.send("file", data);
        fileExists = true;
    }else{
        window.webContents.send("fileNotSupported");
    }
});