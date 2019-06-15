import {app, BrowserWindow, Menu, ipcMain, IpcMain, IpcMessageEvent} from "electron";
import * as url from "url";
import * as path from "path";
import * as fs from "fs";

let mainWindow:BrowserWindow;
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
    Menu.setApplicationMenu(Menu.buildFromTemplate([
        {
            label:"Archivo",
            submenu:[
                {
                    label: "Añadir"
                },
                {
                    label: "Editar"
                },
                {
                    label: "Eliminar"
                },
                {
                    label: "Salir",
                    accelerator: process.platform === "darwin" ? "Command+Q": "Ctrl+Q",
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

ipcMain.on("fileDropped", (e, path)=>{
    const data = fs.readFileSync(path,"utf-8");
    console.log(path);
    console.log(data);
});