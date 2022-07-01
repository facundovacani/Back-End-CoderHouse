

function getLogin(req, res) {
    res.render("login",{
        noLogged:true
    })
}

function postLogin (req, res) {
    let user = req.user;
    req.session.user = user.username;
    req.session.admin = user.admin;
    req.session.logged = true;       
    if(user){
        res.redirect('profile')
    }else{
        res.redirect("error-login")
    }
   
}

function postSignup (req, res) {
    let user = req.user;
    req.session.user = user.username;
    req.session.admin = user.admin;
    req.session.logged = true;   
    if(user){
        res.redirect('profile')

    }else{
        res.redirect("error-signin")
    }
    
}

function getProfile (req, res) {

    let user = req.session.user;
    if(user){
        res.render('profile', { username: user })
    }else{
        res.redirect('login')
    }
    
}

function getFaillogin (req, res) {
    console.log('error en login');
    res.render('error-login', {});
}

function getFailsignup (req, res) {
    console.log('error en signup');
    res.render('error-signin', {});
}

function getLogout (req, res) {
    req.logout( (err) => {
        if (!err) {
            res.render('main');
        } 
    });
}

function failRoute(req, res){
    res.status(404).render('routing-error', {});
}


function getProducts(req,res){
    let existe = true
    if(req.session?.admin){
        res.render("main",{
            listaExiste: existe,
            admin: true,
            username: req.session.user
        });
    }else{
        res.render("main",{
            listaExiste: existe,
            admin: false,
            username: req.session.user
        });
    }        
}

module.exports = {
    
    getLogin,
    postLogin,
    getFaillogin,
    getLogout,
    failRoute,
    postSignup,
    getFailsignup,
    getProfile,
    getProducts
}