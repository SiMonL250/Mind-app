/// <reference types="vite/client" />

import { promises } from 'dns';

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
}
declare global{
    interface Window {
        //只有本地或者https、wss可用
    showOpenFilePicker: (options:filePickerOptions)=>Promise<FileSystemFileHandle>,
    showDirectoryPicker:(options:directoryPickerOptions)=>Promise<FileSystemDirectoryHandle>,
    showSaveFilePicker:(options:fileSaveOptions)=>Promise<FileSystemFileHandle>
}
}
