import {getProjectMember} from '@/api/index.js'

export function getProjectMemberList(projectId, istask) {
    let paramObj = {
        project_id: projectId,
        include_task_info: istask
    }
    let result = getProjectMember(paramObj)

    return result
}
