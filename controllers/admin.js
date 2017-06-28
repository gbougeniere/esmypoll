angular.module('pollApp').controller('AdminController',  ['$scope', function AdminController($scope) {
    var vm = this;
    vm.Math = window.Math;

    vm.closePoll = function () {
        if (vm.statProjection.pollClosed == true)
            return;
        
        var closePollCommand = {
            pollId: vm.statProjection.pollId,
        };

        vm.pollContext.command('ClosePoll', closePollCommand).then(function (pollId) {
            console.log("Command de fermetue de sondage exécutée", pollId);
        })
        .catch(function (error) {
            console.error("Erreur lors de la fermeture du sondage : ", error);
        });
    }

    vm.statProjection = {
        initialize: function (params, done) {
            this.pollId = null;
            this.pollChoices = {};
            this.pollClosed = false;
            this.resultMode = false;
            this.totalVotes = {};
            this.totalVoteCount = 0;
            this.voteBySexe = {
                label: [],
                total: []
            };
            this.voteByAge = {
                label: ["0-9", "10-19", "20-29", "30-39", "40-49", "50-59","60-69","70-79","80-89","90-99","100-109","110-119"],
                series: ["1"],
                total: [[0,0,0,0,0,0,0,0,0,0,0,0]]
            };
            this.voteByHour = {
                label: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
                series: ["1"],
                total: [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
            };
            this.votes = [];
            $scope.$apply();
            return done();
        },
        handlePollCreated: function (domainEvent) {
            var poll = domainEvent.payload.poll;
            this.pollId = domainEvent.aggregate.id;
            this.pollChoices = poll.choises;
            for (var choiceId in poll.choises) {
                this.totalVotes[choiceId] = 0;
            }
            console.log("Sondage créé : " + domainEvent.payload.poll.title);
            $scope.$apply();
        },
        handlePollVoteAdded: function (domainEvent) {
            var vote = domainEvent.payload.vote;
            this.votes.push(vote);
            this.totalVotes[vote.choice]++;
            this.totalVoteCount++;
            
            //Mise à jour projection sexe
            var index = this.voteBySexe.label.indexOf(vote.sexe);
            if (index == -1) {
                this.voteBySexe.label.push(vote.sexe);
                this.voteBySexe.total.push(0);
                index = this.voteBySexe.label.indexOf(vote.sexe)
            }
            this.voteBySexe.total[index]++;

            //Mise à jour projection age
            var ageRange = Math.trunc(vote.age / 10);
            this.voteByAge.total[0][ageRange]++;
            this.voteByHour.total[0][vote.voteHour]++;



            console.log("Vote pris en compte : " + vote.firstName);
            $scope.$apply();
        },
        handlePollClosed: function () {
            console.log("Clôture des votes");
            this.pollClosed = true;
            $scope.$apply();
        },
    };

    var socket = io.connect(':1234');
    socketIORemoteClient = window['eventric-remote-socketio-client'];
    socketIORemoteClient.initialize({
        ioClientInstance: socket
    })
    .then(function () {
        vm.pollContext = eventric.remoteContext('Poll');
        vm.pollContext.initializeProjection(vm.statProjection, {});
        vm.pollContext.setClient(socketIORemoteClient);
    });
}]);