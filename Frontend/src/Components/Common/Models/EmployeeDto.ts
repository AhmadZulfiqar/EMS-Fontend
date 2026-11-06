export interface getAllTableDataDto {
    page:number,
    pageSize:number,
    search?:string | "",
}
export interface createEmployee {
    Name:string,
    Email:string,
    Password:string

}
export interface updateEmployee{
    Name:string,
    Email:string,
  
}
export interface createRole{
    roleName:string
  
}
export interface assignRole{
    userId:string,
    roleId:string |null,
}