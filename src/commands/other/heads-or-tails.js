const headsOrTailsResponses = {
    heads: ['Face.', "C'est face.", "C'est face cette fois-ci."],
    tails: ['Pile.', "C'est pile.", "C'est pile cette fois-ci."],
};

export const headsOrTails = {
    data: {
        name: 'pof',
        type: 1,
        description: 'Demande pile ou face à Siri',
    },
    async execute() {
        const randomProperty = Math.random() < 0.5 ? 'heads' : 'tails';
        const randomResponse =
            headsOrTailsResponses[randomProperty][
            Math.floor(
                Math.random() * headsOrTailsResponses[randomProperty].length
            )
            ];

        return randomResponse;
    }
};
