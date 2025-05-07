const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Default to 500 if not set
    res.status(statusCode).json({
      message: err.message || "Something went wrong",
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  };
  
  export default errorHandler;
  