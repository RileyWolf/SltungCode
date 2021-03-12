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

export function put(url, paramObj) {
    return new Promise((resolve) => {
        axios.put(url, paramObj).then(
            response => {
                resolve(response.data);
            },
            err => {
                console.log(err.response)
                resolve(err.response.data);
            }
        );
    });
}

export function del(url, paramObj) {
    return new Promise((resolve) => {
        axios.delete(url, { data: paramObj }).then(
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

export const checkFilesImported = paramObj => post('/check-files-imported', paramObj) // 檢查該 source_id 於 project_id 下已匯入及剩餘可匯入檔案數目

export const importFiles = paramObj => post('/import-files', paramObj) // 匯入檔案

export const getUserList = paramObj => get('/get-user-list', paramObj) // 取得使用者列表

export const addProjectMember = paramObj => post('/add-project-members', paramObj) // 取得使用者列表

export const getProjectMember = paramObj => post('/get-project-members', paramObj) // 取得專案使用者列表

export const getProjectList = () => get('/get-project-list') // 取得專案清單

export const assignTask = paramObj => post('/assign-task', paramObj) // 分派任務

export const cancelTask = paramObj => del('/cancel-task', paramObj) // 收回已分派的任務

export const getTaskAssignedStatus = paramObj => post('/get-task-assigned-status', paramObj) //取得目前人員分派狀態統計



export const getProjectInfo = paramObj => post('/get-project-info-by-id', paramObj) // 取得單一專案資訊

export const updateProjectInfo = paramObj => put('/manage/project', paramObj) // 更新專案

