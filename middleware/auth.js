import {StatusCodes} from 'http-status-codes'
import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            msg: "Authentication invalid!"
        })
    }else{
        const token = authHeader.split(' ')[1];

        //console.log(`token from the request: ${token}`);

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);

            //console.log(payload);

            // attach the user request object
            req.user = { userId: payload.userId };
            
            next();

          } catch (error) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    msg: "Authentication invalid!"
                })
          }
    }

  };
  
export default auth;