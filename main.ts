import {app, BrowserWindow, Menu, ipcMain, IpcMessageEvent, Accelerator} from "electron";
import * as url from "url";
import * as path from "path";
import * as fs from "fs";
import * as console from "console";
let mainWindow:BrowserWindow = null;
let addWindow:BrowserWindow = null;
const createMainWindow = () =>{
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            nodeIntegration: true
        }
    });
    mainWindow.loadFile("main.html");
    mainWindow.webContents.openDevTools();
    mainWindow.on("closed", () =>{
        app.quit();
    });
    Menu.setApplicationMenu(Menu.buildFromTemplate([{
            label:"Archivo",
            submenu:[{
                    label: "Añadir",
                    accelerator: process.platform === "darwin" ? "Command+N" : "Ctrl+N",
                    click(){
                        createAddWindow();
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
                }
            ]
        },
        {
            label: "Ventas"
        },
        {
            label: "Base de datos"
        },
        {
            label: "Cotizaciones"
        },
        {
            label: "Compras"
        },
        {
            label: "Clientes"
        },
        {
            label: "Facturas"
        }
    ]));
}

const createAddWindow = ()=>{
    addWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            nodeIntegration: true
        }
    });
    addWindow.loadFile("addWindow.html");
}

app.on("ready", createMainWindow);
app.on("window-all-closed", () =>{
   if(process.platform !== "darwin"){
       app.quit();
   } 
});

app.on("activate", () =>{
    if(mainWindow === null){
        createMainWindow();
    }
});

ipcMain.on("fileDropped", (e, path:string)=>{
    const extension = path.split(".")[1];
    if(extension === "json"){
        const data = fs.readFileSync(path,"utf-8");
        mainWindow.webContents.send("file", data);
    }else{
        mainWindow.webContents.send("fileNotSupported");
    }
});