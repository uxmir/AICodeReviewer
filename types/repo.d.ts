export interface Repo{
installationId:number|null,    
currentPage:number|null,
totalPages:number|null,
paginatedData:repoData[]
}

export interface repoData{
id:number| null,
name:string| null,
full_name?:string| null,
html_url:string| null,
private:boolean| null,
description?:string| null,
language:string | null,
updated_at:string | Date

}