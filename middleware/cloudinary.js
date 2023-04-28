const cloudinary = require('cloudinary').v2;
  
cloudinary.config({ 
  cloud_name: 'deyttwtx7', 
  api_key:"761712417856329", 
  api_secret:"m9xKckwOE3JTW_k0RK1Ujaun4ik",
  secure: true
});

module.exports = cloudinary;

// exports.uploads = (file,folder)=>{
//   return new promises(resolve =>{
//     cloudinary.uploader.upload(file,(result)=>{
//       resolve( {
//         url:result.url,
//         id:result.public_id
//       })
//     },{
//       resource_type:"auto",
//       folder:folder
//     })
//   })
// }