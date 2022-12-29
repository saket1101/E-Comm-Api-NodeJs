const checkPermission = (requestUser,resourceUserId)  =>{
    if(requestUser.role == 'admin') return;
    if(requestUser.userId == resourceUserId.toString()) return;

    return console.log('not authorized to access this route')
}

// const checkPermission = () =>{
 
//     return =>{
//         console.log(requestUser)
//     }
// }

module.exports = checkPermission