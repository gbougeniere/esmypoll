angular.module('pollApp').controller('PollController', ['$scope', function PollController($scope) {
    var vm = this;
    vm.Math = window.Math;
    vm.resultMode = false;
    
    vm.showResults = function () {
        $scope.$apply(function () {
            vm.resultMode = true;
        });
    };

    vm.vote = function () {
        if (vm.selectedChoice == undefined || vm.selectedChoice == null || vm.selectedChoice == '')
            return;
        
        var pollVoteCommand = {
            pollId: vm.pollProjection.pollId,
            vote: {
                firstName: vm.identity.firstName,
                lastName: vm.identity.lastName,
                sexe: vm.identity.sexe,
                age: vm.identity.age,
                choice: vm.selectedChoice,
                voteHour: Math.floor(Math.random() * 24)
            }
        };

        vm.pollContext.command('AddVote', pollVoteCommand).then(function (pollId) {
            console.log("Command d'ajout de vote exécutée", pollId);
            vm.showResults();
        })
        .catch(function (error) {
            console.error("Erreur lors de l'ajout du vote : ", error);
        });
    }

    var genders = ['M', 'F'];
    var firstNames = {
        'F' : ["Noemi", "Rose", "Nathalie", "Léonne", "Christiane", "Tiphaine", "Béatrice", "Catherine", "Linda", "Capucine"],
        'M' : ["Maurice", "Justin", "Fernand", "Félix", "Patrick", "Adrien", "Denis", "Loïc", "Amaury", "Georges"],
    };
    var lastNames = ["Martin", "Petit", "Dupond", "Baudouin", "Rainier", "Muller", "Lambert", "Leroy", "Bonnet", "Fournier"];


    var gender = genders[Math.floor(Math.random()*2)];
    vm.identity = {
        firstName: firstNames[gender][Math.floor(Math.random() * firstNames[gender].length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
        sexe: gender,
        age: Math.floor(Math.random() * 50) + 15
    };
    
    vm.selectedChoice = "";

    vm.selectChoice = function (choiceId) {
        vm.selectedChoice = choiceId;
    };

    vm.pollProjection = {
        initialize: function (params, done) {
            this.pollName = "";
            this.pollList = [];
            this.pollId = null;
            this.pollClosed = false;
            $scope.$apply();
            return done();
        },
        handlePollCreated: function (domainEvent) {
            console.log("Sondage créé : " + domainEvent.payload.poll.title);
            var poll = domainEvent.payload.poll;
            this.pollList = poll.choises;
            this.pollName = poll.title
            this.pollId = domainEvent.aggregate.id;
            $scope.$apply();
        },
        handlePollClosed: function () {
            console.log("Clôture des votes");
            this.pollClosed = true;
            $scope.$apply();
        },
    };

    vm.resultProjection = {
        initialize: function (params, done) {
            //Mettre ici tout code d'initialisation
            this.totalVoteCount = 0;
            this.totalVotes = {};
            $scope.$apply();            
            return done();
        },
        handlePollCreated: function (domainEvent) {
            var poll = domainEvent.payload.poll;
            for (var choiceId in poll.choises) {
                this.totalVotes[choiceId] = 0;
            }
            console.log("Sondage créé : " + poll.title);
            $scope.$apply();            
        },
        handlePollVoteAdded: function (domainEvent) {
            var vote = domainEvent.payload.vote;
            this.totalVotes[vote.choice]++;
            this.totalVoteCount++;
            console.log("Vote pris en compte : " + vote.firstName);
            $scope.$apply();
        }
    };

    //var socket = io.connect('http://192.168.1.34:1234');
    var socket = io.connect(':1234');
    socketIORemoteClient = window['eventric-remote-socketio-client'];
    socketIORemoteClient.initialize({
        ioClientInstance: socket
    })
    .then(function () {
        vm.pollContext = eventric.remoteContext('Poll');
        vm.pollContext.initializeProjection(vm.pollProjection, {});
        vm.pollContext.initializeProjection(vm.resultProjection, {});
        vm.pollContext.setClient(socketIORemoteClient);
    });
}]);