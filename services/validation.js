class ValidationService {
    static validate_name(req, res, next) {
        let name = req.body.username.trim();
        if(name.length < 1 || name.length > 30) {
            return res.status(404).json({ message: 'username invalid' }); 
        }else{
            req.body.username = ValidationService.escape(name);
            next();
        }
    }

    static validate_email(req, res, next) {
        let email = req.body.email.trim();
        if(email.length < 1 || email.length > 30) {
            return res.status(404).json({ message: 'email invalid' }); 
        }else{
            req.body.email = ValidationService.escape(email);
            next();
        }
    }

    static validate_password(req, res, next) {
        let password = req.body.password.trim();
        if(password.length < 5 || password.length > 30) {
            return res.status(404).json({ message: 'password invalid' }); 
        }else{
            req.body.password = ValidationService.escape(password);
            next();
        }
    }

    static validate_answer(req, res, next) {
        let text = req.body.text.trim();
        if(text.length < 1 || text.length > 500) {
            return res.status(404).json({ message: 'answer invalid' }); 
        }else{
            req.body.text = ValidationService.escape(text);
            next();
        }
    }

    static validate_question(req, res, next) {
        let text = req.body.text.trim();
        if(text.length < 1 || text.length > 500) {
            return res.status(404).json({ message: 'question invalid' }); 
        }else{
            req.body.text = ValidationService.escape(text);
            next();
        }
    }

    static escape(string) {
        let out = string;
        out = out.replace(/>/g, "&#62;");
        out = out.replace(/</g, "&#60;");
        out = out.replace(/&/g, "&#38;");
        out = out.replace(/'/g, "&#39;");
        out = out.replace(/"/g, "&#34;");
        out = out.replace(/\//g, "&#47;");
        return out;
    };
}


module.exports = ValidationService;
