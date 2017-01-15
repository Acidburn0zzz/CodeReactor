/**
 * @author      Alex Mourtziapis <alex.mourtziapis@gmail.com>
 * @license     {@link http://opensource.org/licenses/MIT|MIT License}
 */

Code_Reactor.Git = function (Code_Reactor) {

  this.hasGit = false;

  this.isRepo = undefined;
  try {
    var stats = Code_Reactor.fs.lstatSync('.git');
    this.isRepo = true;
  } catch (e) {
    this.isRepo = false;
  }

  this.buffer = [];
};

Code_Reactor.Git.prototype = {
  /**
   * Init repo
   * @method Code_Reactor.Git#inits
   */
  init: function () {
    if (this.hasGit && !this.isRepo) {
      Code_Reactor.shell.exec("git init", function (code, output) {
        if (code !== 0) {
          Code_Reactor.log[0].log("Err", "Git init failed: " + output);
        } else {
          Code_Reactor.log[0].log("Log", "Git init " + output);
        }
      });
      this.isRepo = true;
    }
  },

  /**
   * Commit local changes!
   * @method Code_Reactor.Git#commit
   */
  commit: function () {
    if (this.hasGit && this.isRepo) {
      var message = prompt("Commit Message", "");
      Code_Reactor.shell.exec('git commit -m "' + message + '"', function (code, output) {
        if (code !== 0) {
          Code_Reactor.log[0].log("Err", "Git commit failed: " + output);
        } else {
          Code_Reactor.log[0].log("Log", "Git commit " + message + output);
        }
      });
    }
  },

  /**
   * Pull all changes from current tracking branch
   * @method Code_Reactor.Git#pull
   */
  pull: function () {
    if (this.hasGit && this.isRepo) {
      Code_Reactor.shell.exec("git pull", function (code, output) {
        if (code !== 0) {
          Code_Reactor.log[0].log("Err", "Git pull failed: " + output);
        } else {
          Code_Reactor.log[0].log("Log", "Git pull " + output);
        }
      });
    }
  },

  /**
   * Push all commits to current tracking branch
   * @method Code_Reactor.Git#push
   */
  push: function () {
    if (this.hasGit && this.isRepo) {
      Code_Reactor.shell.exec("git push origin", function (code, output) {
        if (code !== 0) {
          Code_Reactor.log[0].log("Err", "Git push failed: " + output);
        } else {
          Code_Reactor.log[0].log("Log", "Git push origin " + output);
        }
      });
    }
  },

  /**
   * Clone a repo
   * @method Code_Reactor.Git#clone
   */
  clone: function () {
    if (this.hasGit && !this.isRepo) {
      var url = prompt("Repo URL", "https://");
      var branch = prompt("Branch", "master");

      Code_Reactor.shell.exec("git clone -b" + branch + " " + url, function (code, output) {
        if (code !== 0) {
          Code_Reactor.log[0].log("Err", "Git clone failed: " + output);
        } else {
          Code_Reactor.log[0].log("Log", output);
        }
      });

      this.isRepo = true;
    }
  },

  /**
   * Add file
   * @method Code_Reactor.Git#add
   */
  add: function (file) {
    if (this.hasGit && this.isRepo) {
      if (file === undefined) {
        var file = prompt("Add file", "README.md")
      }

      Code_Reactor.shell.exec("git add " + file, function (code, output) {
        if (code !== 0) {
          Code_Reactor.log[0].log("Err", "Git add failed: " + output);
        } else {
          Code_Reactor.log[0].log("Log", "Git add " + file);
        }
      });
    }
  },

  /**
   * Add all files
   * @method Code_Reactor.Git#addAll
   */
  addAll: function () {
    if (this.hasGit && this.isRepo) {
      this.modifiedFiles(function () {
        for (var i = 0; i < Code_Reactor.Git.buffer.length; i++) {
          Code_Reactor.Git.add('"' + Code_Reactor.Git.buffer[i] + '"');
        }
        Code_Reactor.Git.buffer = [];
      });
    }
  },

  /**
   * Reset file
   * @method Code_Reactor.Git#reset
   */
  reset: function (file) {
    if (this.hasGit && this.isRepo) {
      if (file === undefined) {
        var file = prompt("Reset file", "README.md")
      }

      Code_Reactor.shell.exec("git reset " + file, function (code, output) {
        if (code !== 0) {
          Code_Reactor.log[0].log("Err", "Git reset failed: " + output);
        } else {
          Code_Reactor.log[0].log("Log", "Git reset " + file);
        }
      });
    }
  },

  /**
   * Reset all files
   * @method Code_Reactor.Git#reset
   */
  resetAll: function () {
    if (this.hasGit && this.isRepo) {
      this.modifiedFiles(function () {
        for (var i = 0; i < Code_Reactor.Git.buffer.length; i++) {
          Code_Reactor.Git.reset('"' + Code_Reactor.Git.buffer[i] + '"');
        }
        Code_Reactor.Git.buffer = [];
      });
    }
  },

  /**
   * Detect if user has git and set inital values of "hasGit" var
   * @method Code_Reactor.Git#set
   */
  set: function () {
    Code_Reactor.shell.cd(this.projectPath);

    this.hasGit = Code_Reactor.shell.which('git');
    if (!this.hasGit) {
      Code_Reactor.log[0].log("Err", "Sorry, this script requires git");
    }
  },

  /**
   * Configure git
   * @method Code_Reactor.Git#config
   */
  config: function () {
    if (this.hasGit) {
      var username = prompt("name", "Big.T");

      Code_Reactor.shell.exec("git config --global user.name " + username, function (code, output) {
        if (code !== 0) {
          Code_Reactor.log[0].log("Err", "Git config failed: " + output);
        } else {
          Code_Reactor.log[0].log("Log", "Git config username " + username + output);
        }
      });

      var email = prompt("email address", "big.t@gmail.com");

      Code_Reactor.shell.exec("git config --global user.email " + email, function (code, output) {
        if (code !== 0) {
          Code_Reactor.log[0].log("Err", "Git config failed: " + output);
        } else {
          Code_Reactor.log[0].log("Log", "Git config email " + email + output);
        }
      });
    }
  },

  /**
   * Get a list of all modified files
   * @method Code_Reactor.Git#modifiedFiles
   * @return {Array<string>}
   */
  modifiedFiles: function (callback) {
    Code_Reactor.shell.exec("git commit", function (code, output) {
      var changes = output.split(/\r\n|\r|\n/);

      if (code !== 0) {
        for (var i = 3; i < changes.length; i++) {
          if (changes[i].indexOf("modified") > -1) {
            var file = changes[i].split(":");
            Code_Reactor.Git.buffer.push(file[1].trim());
          }
        }
        callback();
      }
    });
  }
};
