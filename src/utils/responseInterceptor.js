 module.exports = {
    /**
     * @description this function is used to create success response
     * @param {*} res 
     * @param {*} message 
     * @param {*} code 
     * @param {*} data 
     * @returns resolved message
     */
     successResponse : ( res ,  message , code ,  data, metaData = null ) =>{
      const responseObject = {
         message: message,
         code: code,
         data: data
     };
 
     if (metaData !== null) {
         responseObject.metaData = metaData;
     }
     return res.status(code).json(responseObject);
     },
     /**
      * @param {*} res 
      * @param {*} message 
      * @param {*} code 
      * @param {*} data 
      * @description this function is used to handle the error response
      */
     errorResponse : (res, message , code) =>{
        return res.status(code).json({
            message: message,
            code: code,
        });
     }
}
  