// Generated by CoffeeScript 1.12.2
(function() {
  var Poll, SocketIORemoteEndpoint, eventric, io, pollContext, socketIO, socketIORemoteEndpoint, socketIORemoteEndpointOptions;

  eventric = require('eventric');

  socketIO = require('socket.io');

  SocketIORemoteEndpoint = require('eventric-remote-socketio-endpoint');

  socketIORemoteEndpoint = new SocketIORemoteEndpoint;

  io = socketIO.listen(1234);

  socketIORemoteEndpointOptions = {
    socketIoServer: io
  };

  socketIORemoteEndpoint.initialize(socketIORemoteEndpointOptions);

  eventric.addRemoteEndpoint(socketIORemoteEndpoint);

  pollContext = eventric.context('Poll');

  pollContext.defineDomainEvents({
    PollCreated: function(arg) {
      var poll;
      poll = arg.poll;
      return this.poll = poll;
    },
    PollVoteAdded: function(arg) {
      var vote;
      vote = arg.vote;
      return this.vote = vote;
    },
    PollClosed: function() {}
  });

  pollContext.addAggregate('Poll', Poll = (function() {
    function Poll() {}

    Poll.prototype.create = function(arg) {
      var poll;
      poll = arg.poll;
      if (!poll) {
        throw new Error("Sondage incomplet");
      }
      if (this.isCreated) {
        throw new Error("La création du sondage a déjà été effectuée");
      }
      return this.$emitDomainEvent('PollCreated', {
        poll: poll
      });
    };

    Poll.prototype.addVote = function(arg) {
      var vote;
      vote = arg.vote;
      if (this.isClosed) {
        throw new Error("Il n'est pas possible de voter pour un sondage terminé");
      }
      this.$emitDomainEvent('PollVoteAdded', {
        vote: vote
      });
      if (this.voteCount === this.maxVotes) {
        return this.$emitDomainEvent('PollClosed');
      }
    };

    Poll.prototype.close = function() {
      return this.$emitDomainEvent('PollClosed');
    };

    Poll.prototype.handlePollCreated = function(arg) {
      var payload;
      payload = arg.payload;
      this.isCreated = true;
      return this.maxVotes = payload.poll.maxVotes;
    };

    Poll.prototype.handlePollVoteAdded = function() {
      if (!this.voteCount) {
        this.voteCount = 0;
      }
      return this.voteCount++;
    };

    Poll.prototype.handlePollClosed = function() {
      return this.isClosed = true;
    };

    return Poll;

  })());

  pollContext.addCommandHandlers({
    CreatePoll: function(arg) {
      var poll;
      poll = arg.poll;
      return this.$aggregate.create('Poll', {
        poll: poll
      }).then(function(poll) {
        return poll.$save();
      });
    },
    AddVote: function(arg) {
      var pollId, vote;
      pollId = arg.pollId, vote = arg.vote;
      return this.$aggregate.load('Poll', pollId).then(function(poll) {
        poll.addVote({
          vote: vote
        });
        return poll.$save();
      });
    },
    ClosePoll: function(arg) {
      var pollId;
      pollId = arg.pollId;
      return this.$aggregate.load('Poll', pollId).then(function(poll) {
        poll.close();
        return poll.$save();
      });
    }
  });

  pollContext.subscribeToDomainEvent('PollCreated', function(domainEvent) {
    return console.log("Ajout d'un nouveau sondage : ", domainEvent.aggregate.id);
  });

  pollContext.subscribeToDomainEvent('PollVoteAdded', function(domainEvent) {
    return console.log('Nouveau vote pour le sondage : ', domainEvent.aggregate.id);
  });

  pollContext.initialize().then(function() {
    return pollContext.command('CreatePoll', {
      poll: {
        title: "On regarde quoi ce soir ?",
        maxVotes: 40,
        choises: {
          "99b20440-b9ef-4970-848a-835836b83f9e": {
            id: "99b20440-b9ef-4970-848a-835836b83f9e",
            title: "Pulp Fiction",
            description: "L'odyssée sanglante et burlesque de petits malfrats dans la jungle de Hollywood à travers trois histoires qui s'entremêlent.",
            img: "http://fr.web.img5.acsta.net/c_75_100/medias/nmedia/18/36/02/52/18846059.jpg"
          },
          "8ff32d46-64ad-480c-a141-3268c7deac94": {
            id: "8ff32d46-64ad-480c-a141-3268c7deac94",
            title: "Forrest Gump",
            description: "Quelques décennies d'histoire américaine, des années 1940 à la fin du XXème siècle, à travers le regard et l'étrange odyssée d'un homme simple et pur, Forrest Gump.",
            img: "http://fr.web.img5.acsta.net/c_75_100/pictures/15/10/13/15/12/514297.jpg"
          },
          "93c885d0-f69a-4ee0-b77e-f2a9a76bbca1": {
            id: "93c885d0-f69a-4ee0-b77e-f2a9a76bbca1",
            title: "La ligne verte",
            description: "Paul Edgecomb, pensionnaire centenaire d'une maison de retraite, est hanté par ses souvenirs. Gardien-chef du pénitencier de Cold Mountain en 1935, il était chargé de veiller au bon déroulement des exécutions capitales...",
            img: "http://fr.web.img5.acsta.net/c_75_100/medias/nmedia/18/66/15/78/19254683.jpg"
          },
          "ca8c92b1-2ab5-4d7a-bf92-fb33e75e4ca8": {
            id: "ca8c92b1-2ab5-4d7a-bf92-fb33e75e4ca8",
            title: "Matrix",
            description: "Programmeur anonyme dans un service administratif le jour, Thomas Anderson devient Neo la nuit venue. Sous ce pseudonyme, il est l'un des pirates les plus recherchés du cyber-espace.",
            img: "http://fr.web.img1.acsta.net/c_75_100/medias/04/34/49/043449_af.jpg"
          },
          "184831ea-0119-4413-91ce-1c6deecac303": {
            id: "184831ea-0119-4413-91ce-1c6deecac303",
            title: "Memento",
            description: "Leonard Shelby ne porte que des costumes de grands couturiers et ne se déplace qu'au volant de sa Jaguar. En revanche, il habite dans des motels miteux et règle ses notes avec d'épaisses liasses de billets.",
            img: "http://fr.web.img3.acsta.net/c_75_100/medias/nmedia/18/36/06/10/18449315.jpg"
          }
        }
      }
    });
  });

}).call(this);
