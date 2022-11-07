const User = require('../Models/table_user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/auth');

class LoginController {

  async index(req, res) {
    const { email, password } = req.body;
    const userExist = await User.findOne({ where:{ email: email , password: password}})
    

    if(!userExist){
      return res.status(400).json({
        error: true,
        message: "Falha na autenticação!"
      })
    }
     

    return res.status(200).json({
      user: {
        name: userExist.name,
        email: userExist.email
      },
      token: jwt.sign(
        {id: userExist.id}, 
        config.secret, 
        {expiresIn: config.expireIn} 
      )
    })
  }
}

module.exports = new LoginController();