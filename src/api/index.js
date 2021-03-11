import axios from 'axios'

export function post(url, paramObj) {
    return new Promise((resolve) => {
        axios.post(url, paramObj).then(
            response => {
                resolve(response.data);
            },
            err => {
                console.log(err.response)
                resolve(err.response.data);
                // resolve(err.response.request.response);
            }
        );
    });
}

export function get(url) {
    return new Promise((resolve) => {
        axios.get(url).then(
            response => {
                resolve(response.data);
            },
            err => {
                console.log(err.response)
                resolve(err.response.data);
                // resolve(err.response.request.response);
            }
        );
    });
}

export const loginUser = paramObj => post('/login', paramObj) // 登入使用者

export const saveNewProject = paramObj => post('/new-project', paramObj) // 新增專案

export const checkProName = paramObj => post('/check-project-name', paramObj) // 驗證專案名稱是否重複

export const saveLabelSetting = paramObj => post('/label-settings', paramObj) // 儲存標注設定

export const getDataSource = () => get('/get-data-source') // 取得檔案來源

export const importFiles = paramObj => post('/import-files', paramObj) // 匯入檔案

export const getUserList = paramObj => get('/get-user-list', paramObj) // 取得使用者列表

export const addProjectMember = paramObj => post('/add-project-members', paramObj) // 取得使用者列表

export const getProjectMember = paramObj => post('/get-project-members', paramObj) // 取得專案使用者列表

export const getProjectList = () => get('/get-project-list') // 取得專案清單
