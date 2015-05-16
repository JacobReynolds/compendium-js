!function() {
    // Factory for analysis objects
    extend(factory, {
        entity: function(token, index, type) {
            return {
                raw: token.raw,
                norm: token.norm,
                fromIndex: index,
                toIndex: index,
                type: type || null,
                meta: {}
            };
        },
        sentence: function(str) {
            return {
                // Time spent for sentence analysis 
                // (bullshit because some detectors are not taken in account).
                time: 0,
                // Count of tokens in the sentence
                length: 0,
                // Governor of the sentence 
                // (dependency parsing)
                governor: -1,
                // Raw sentence string
                raw: str,
                // Those statistics are used by the 
                // detectors (entity detection, quality evalution)
                stats: {
                    // Confidence in PoS tagging
                    // - Can be used to spot foreign text as well as estimate text quality
                    confidence: 0,
                    // Percentage of foreign tokens accross all tokens
                    // - Can be used to spot foreign text
                    p_foreign: 0,
                    // Percentage of uppercased tokens
                    p_upper: 0,
                    // Percentage of tokens capitalized
                    // - Will allow to define headline sentence type
                    // - May disable entity recognition based on capitalization
                    p_cap: 0,
                    // Average token length
                    // - Can be used as indicator for text quality
                    avg_length: 0,
                    // Number of breakpoints
                    breakpoints: 0
                },
                // type: 'unknown',
                profile: {
                    label: 'neutral',
                    sentiment: 0,
                    emphasis: 1,
                    amplitude: 0,
                    politeness: 0,
                    dirtiness: 0,
                    // Types. A sentence can have many types:
                    // (e.g. `imperative` + `refusal` for `don't do it` or
                    // `foreign` + `interrogative` for `Suis-je le monstre?`)
                    // `imperative`, 
                    // `declarative`, 
                    // `approval`, 
                    // `refusal`, 
                    // `interrogative`, 
                    // `headline`
                    // `foreign`
                    types: [],
                    main_tense: 'present'
                },
                has_negation: false,
                entities: [],
                //dependencies: null,
                tokens: [],
                tags: []
            };
        }, 
        token: function(raw, pos) {
            var norm = raw.toLowerCase();
            return {
                raw: raw,
                norm: norm,
                stem: compendium.stemmer(norm),
                pos: pos || '',
                profile: {
                    sentiment: 0,
                    emphasis: 1,
                    negated: false,
                    breakpoint: false
                },
                attr: {
                    acronym: false,
                    abbr: false,
                    is_verb: pos.indexOf('VB') === 0,
                    infinitive: null,
                    is_noun: pos.indexOf('NN') === 0,
                    plural: null,
                    singular: null,
                    entity: -1
                },
                deps: {
                    master: null,
                    governor: false,
                    type: 'unknown'
                }
            };
        },

        // Internal, used by PoS tagger to represent a tag probability
        tag: function(tag, confidence) {
            return {
                tag: tag || 'NN',
                confidence: confidence || 0
            }
        }
    });
}();