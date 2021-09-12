class MyErrors extends Error {
    constructor(statusCode, errorMsg){
        super();
        this.statusCode = statusCode
        this.errorMsg = errorMsg 
    }

    static dataValidationError(errorMsg="Please Enter Valid Data"){
        return new MyErrors(422, errorMsg)
    }

    static notFoundError(errorMsg="Please Enter Valid Data"){
        return new MyErrors(404, errorMsg)
    }

    static alreadyExist(errorMsg="Please Enter Unique Email"){
        return new MyErrors(422, errorMsg)
    }

    static invalidFileFormat(errorMsg="Please Enter Valid File Format."){
        return new MyErrors(422, errorMsg)
    }
}

module.exports = MyErrors