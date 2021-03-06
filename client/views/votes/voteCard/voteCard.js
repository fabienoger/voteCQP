/*****************************************************************************
#                                                                            #
#                                   RENDERED                                 #
#                                                                            #
*****************************************************************************/
Template.voteCard.rendered = function() {
}

/*****************************************************************************
#                                                                            #
#                                   EVENTS                                   #
#                                                                            #
*****************************************************************************/
Template.voteCard.events({
  // Update vote
  'click .update-vote-card': function(e, t) {
    e.stopPropagation();
    var voteId = e.currentTarget.dataset.id;
    console.log("Update => ", e.currentTarget.dataset.id);
    $('.ui.small.modal.update-vote-' + voteId).modal('show');
  },
  // Remove vote
  'click .remove-vote-card': function(e, t) {
    e.stopPropagation();
    Meteor.call("removeVote", e.currentTarget.dataset.id, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        if (result == 1) {
          Modules.client.utils.displayPanel("vote-options-list-info", "positive", "checkmark", "Your vote was successfully removed !");
        }
      }
    });
  },
  'click .ui.button.vote-option': function(e, t) {
    // Set variables
    var mongoId = e.target.dataset.id;
    var childs = e.target.parentElement.children;
    var vote = Votes.findOne({_id: mongoId});
    var result = false;

    // Check if user has already voted
    if (vote.usersId) {
      var r = Modules.both.utils.contains(vote.usersId, Meteor.userId());
      if (r == true)
        result = true;
    }

    if (result == false) {
      // Remove class for all elements
      for(var i = 0; i < childs.length; i++) {
        childs[i].classList.remove("blue");
        childs[i].classList.remove("selected-option");
      }
      // Add class to option .selected-option
      e.target.className += " blue selected-option";
      // update mongo object
      Meteor.call("updateVote", mongoId, e.target.dataset.name, Meteor.userId(), function(result, error) {
        if (error) {
          console.log(error);
        } else {
          console.log(result);
        }
      });
    } else {
      // Add display panel
      Modules.client.utils.displayPanel("vote-options-list-info", "negative", "warning", "You have already voted !");
    }
  }
});
/*****************************************************************************
#                                                                            #
#                                   HELPERS                                  #
#                                                                            #
*****************************************************************************/
Template.voteCard.helpers({
  // If current user create this vote
  myVote: function(voteId) {
    var vote = Votes.findOne({_id: voteId});
    if (vote.createdBy == Meteor.userId()) {
      return true;
    } else {
      return false;
    }
  },
  // Return all users who vote
  userListVote: function(voteId) {
    // Set variables
    var vote = Votes.findOne({_id: voteId});
    var usersWhoVoted = [];
    // Loop on vote.options
    _.map(vote.usersId, function(userId) {
      usersWhoVoted.push(Meteor.users.findOne({_id: userId}));
    });
    return usersWhoVoted;
  },
  // If currentUser vote
  ifVoted: function(voteId, nameOption) {
    // Get mongo object vote
    var vote = Votes.findOne({_id: voteId});
    var result = false;
    // Check if options is voted
    _.map(vote.options, function(option) {
      if (option.name == nameOption) {
        if (Modules.both.utils.contains(option.usersId, Meteor.userId()) == true)
          result = true;
      }
    });
    return result;
  },
  // Return mongo vote object
  voteOptionsList: function(id) {
    var vote = Votes.findOne({_id: id});
    return vote.options || null;
  }
});
