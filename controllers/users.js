const User = require('../models/user');

module.exports.getRegister = (req, res) => {
    res.render('users/register');
}

module.exports.postRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username: username, email: email });
        await User.register(user, password);
        // console.log(user);
        req.login(user, err => {
            if (err) return next(err)
            req.flash('success', 'Welcome!')
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.getLogin = (req, res) => {
    res.render('users/login');
}


module.exports.postLogin = (req, res) => {
    req.flash('success', `Welcome back, ${req.body.username}!`);
    // the url in session just come from isLogin middleware in specific request.
    // If you click navbar 'login' button and login on some specific page, there will be no url store in session, and cannot redirect to this page
    // so it need to store the url of the page to the session before click 'login'
    // means store the url in every request (show page, ) except login request
    const url = req.session.url || '/campgrounds';
    delete req.session.url;
    res.redirect(url);
}


module.exports.logout = (req, res) => {
    req.logout();
    const url = req.session.url || '/campgrounds';
    delete req.session.url;
    res.redirect(url);
}