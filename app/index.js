var TravisGenerator = require('../lib/travis-generator');
var path = require('path');
var util = require('util');

module.exports = Generator;

function Generator() {
    TravisGenerator.apply(this, arguments);
    this.appname = path.basename(process.cwd());
    this.desc('This generator creates a .travis.yml that tells travis-ci to build your yeoman project and push the build to your gh-pages branch, on every commit to master.');
}

util.inherits(Generator, TravisGenerator);

Generator.prototype.writeDotTravisFile = function () {
    this._displayLogo()
        .then(this._initializeGitHubApi.bind(this))
        .then(this._celebrate.bind(this, 'Initialize GitHub Api'), this._mourn.bind(this, 'Initialize GitHub Api'))

        .then(this._initializeTravisApi.bind(this))
        .then(this._celebrate.bind(this, 'Initialize Travis-ci Api'), this._mourn.bind(this, 'Initialize Travis-ci Api'))

        .then(this._repositoryInformation.bind(this))
        .then(this._celebrate.bind(this, 'Query Repository Information'), this._mourn.bind(this, 'Query Repository Information'))

        .then(this._gitHubLogin.bind(this))
        .then(this._celebrate.bind(this, 'Login to GitHub Api'), this._mourn.bind(this, 'Login to GitHub Api'))

        .then(this._ensureTravisAppAuthorized.bind(this))
        .then(this._celebrate.bind(this, 'Ensure GitHub Travis App Authorized'), this._mourn.bind(this, 'Ensure GitHub Travis App Authorized'))

        .then(this._generateGitHubOAuthToken.bind(this))
        .then(this._celebrate.bind(this, 'Generate GitHub OAuth Token'), this._mourn.bind(this, 'Generate GitHub OAuth Token'))

        .then(this._travisGitHubAuthentication.bind(this))
        .then(this._celebrate.bind(this, 'Login to Travis-ci Api'), this._mourn.bind(this, 'Login to Travis-ci Api'))

        .then(this._ensureTravisRepositoryHookSet.bind(this))
        .then(this._celebrate.bind(this, 'Ensure Travis Repository Hook Set'), this._mourn.bind(this, 'Ensure Travis Repository Hook Set'))

        // .then(this._revokeGitHubOAuthToken.bind(this))
        // .then(this._celebrate.bind(this, 'Revoke GitHub OAuth Token'), this._mourn.bind(this, 'Revoke GitHub OAuth Token'))

        .then(function () {
            this.directory('.', '.');
            this.template('.travis.yml', '.travis.yml', {});
        }.bind(this))
        .fail(this._mourn.bind(this, 'Write Template'))
        .then(this.async());
};
