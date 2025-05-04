let displayPercentage = false,
    hideCounter = false,
    showRemaining = false,
    displayGoalText = 'Goal',
    countCheers = true,
    countSub = true,
    countMember = true,
    subValue = 50,
    memberValue = 50,
    bitValue = 0.01,
    countTips = true,
    countSuperchats = false,
    displayGoalCurrency = '$',
    displayRemainingText = 'Remaining',
    goal = 0,
    useSubBuyValue = 0,
    useMemberBuyValue = 0,
    manualInput = 0,
    displayStartingImg = '',
    sessionData = undefined,
    goalFinishedSound = undefined,
    goalChangeFinishedColor = true,
    customFontFamily = '',
    additionalUsers = [],
    chatCommands = {
        hideMTGCounter: '',
        manualInput: '',
        resetManualInput: '',
        manualApplyOverflow: '',
        manualClearOverflow: '',
    },
    storeSavedValues = {
        lastGoalOverflow: 0,
        manualInput: 0,
    };

const storeKey = 'multi_type_goal_store';

window.addEventListener('onEventReceived', function (obj) {
    const listener = obj.detail.listener;
    const event = obj.detail.event;
    // handle the manual buttons
    if (listener === 'test') {
        handleManualButtons(event);
    }
    // handle chat commands
    else if (listener === 'message') {
        handleChatCommands(event);
    }
});

window.addEventListener('onSessionUpdate', function (obj) {
    // When session data changes handle the update of the goal
    sessionData = obj.detail.session;
    updateDisplay();
});

window.addEventListener('onWidgetLoad', async function (obj) {
    //load the store value
    let storeValue;
    try {
        storeValue = await SE_API.store.get(storeKey);
    } catch (e) {}
    if (storeValue === undefined || storeValue === null) {
        SE_API.store.set(storeKey, storeSavedValues);
    } else if (isNaN(storeValue.lastGoalOverflow) || isNaN(storeValue.manualInput)) {
        storeSavedValues = storeValue;
    } else {
        storeSavedValues = {
            lastGoalOverflow: +storeValue.lastGoalOverflow,
            manualInput: +storeValue.manualInput,
        };
    }
    //load setting values
    const fieldData = obj.detail.fieldData;
    displayPercentage = fieldData.showPercentageOfFulfillment;
    showRemaining = fieldData.showRemainingValueInstead;
    displayGoalText = fieldData.displayGoalText;
    countCheers = fieldData.countCheers;
    bitValue = fieldData.bitValue;
    countSub = fieldData.countSub;
    countMember = fieldData.countMember;
    subValue = fieldData.subValue;
    memberValue = fieldData.memberValue;
    countTips = fieldData.countTips;
    countSuperchats = fieldData.countSuperchats;
    displayGoalCurrency = fieldData.displayGoalCurrency;
    displayRemainingText = fieldData.displayRemainingText;
    goal = fieldData.goal;
    useSubBuyValue = fieldData.useSubBuyValue;
    useMemberBuyValue = fieldData.useMemberBuyValue;
    manualInput = fieldData.manualInput;
    goalChangeFinishedColor = fieldData.goalChangeFinishedColor;
    if (fieldData.goalFinishedSound) {
        goalFinishedSound = new Audio(fieldData.goalFinishedSound);
        goalFinishedSound.volume = fieldData.goalFinishedSoundVolume / 100;
    }
    displayStartingImg = fieldData.displayStartingImg;
    hideCounter = fieldData.hideMTGCounter;
    customFontFamily = fieldData.customFontFamily;
    chatCommands = {
        hideMTGCounter: fieldData.hideMTGCounterChat,
        manualInput: fieldData.manualInputChat,
        resetManualInput: fieldData.resetManualInputChat,
        manualApplyOverflow: fieldData.manualAddOverflowChat,
        manualClearOverflow: fieldData.manualClearOverflowChat,
    };

    // Split the additionaluser list into an array of single user names.
    if (fieldData.additionalUsers !== '') {
        if (fieldData.additionalUsers.includes(',')) {
            additionalUsers = fieldData.additionalUsers.split(',');
            additionalUsers = additionalUsers.map((element) => element.trim()).filter((element) => element.length > 0);
        } else {
            additionalUsers = [fieldData.additionalUsers.trim()];
        }
    }

    if (customFontFamily !== '') {
        customFontLoad();
    }

    sessionData = obj.detail.session.data;
    updateDisplay();
});

function calcReachedValue() {
    if (!storeSavedValues.manualInput) {
        storeSavedValues.manualInput = 0;
    }
    let reachedValue = storeSavedValues.manualInput;
    if (countTips) {
        try {
            reachedValue += sessionData['tip-goal']['amount'] || 0;
        } catch (e) {}
    }
    if (countSub) {
        try {
            reachedValue += +(sessionData['subscriber-goal']['amount'] * useSubBuyValue * (subValue / 100)).toFixed(2) || 0;
        } catch (e) {}
    }
    if (countCheers) {
        try {
            reachedValue += +(sessionData['cheer-goal']['amount'] * bitValue).toFixed(2) || 0;
        } catch (e) {}
    }
    if (countSuperchats) {
        try {
            reachedValue += +(sessionData['superchat-goal']['amount'] * 0.7).toFixed(2) || 0;
        } catch (e) {}
    }
    if (countMember) {
        try {
            reachedValue += +(sessionData['sponsor-goal']['amount'] * useMemberBuyValue * (memberValue / 100)).toFixed(2) || 0;
        } catch (e) {}
    }
    if (reachedValue >= goal) {
        if (goalChangeFinishedColor) {
            document.getElementById('multi-type-goal__main-container').classList.add('goal-finished-background');
        }
        handleGoalReached(reachedValue);
    } else {
        document.getElementById('multi-type-goal__main-container').classList.remove('goal-finished-background');
    }
    return +reachedValue.toFixed(2);
}

async function customFontLoad() {
    const customFont = new FontFace(customFontFamily, 'local(' + customFontFamily + ')');
    try {
        await customFont.load();
        document.fonts.add(customFont);
        document.body.style.fontFamily = customFontFamily;
    } catch (e) {
        console.error(e);
    }
}

function updateDisplay() {
    console.log(sessionData);
    const counter = document.getElementById('multi-type-goal__main-container');
    if (hideCounter) {
        counter.classList.add('hidden');
    } else {
        counter.classList.remove('hidden');
    }
    const percentageDisplay = document.getElementById('percentage-display-outside');
    const remainingDisplay = document.getElementById('goal-remaining-display');
    const goalReachedDisplay = document.getElementById('goal-reached-display');
    const leadingImage = document.getElementById('leading-image');

    let displayedValue = calcReachedValue();
    if (showRemaining) {
        goalReachedDisplay.classList.add('hidden');
        displayedValue = Math.max(goal - displayedValue, 0);
        remainingDisplay.children[0].innerHTML = displayedValue.toFixed(2) + ' ' + displayGoalCurrency;
    } else {
        remainingDisplay.classList.add('hidden');
        goalReachedDisplay.children[0].innerHTML = displayedValue.toFixed(2);
    }
    if (displayPercentage && goal !== 0) {
        const percentage = +((displayedValue / goal) * 100).toFixed(2);
        percentageDisplay.children[0].innerHTML = percentage + '%';
    } else {
        percentageDisplay.classList.add('hidden');
    }
    if (!displayStartingImg) {
        leadingImage.classList.add('hidden');
    } else {
        leadingImage.classList.remove('hidden');
    }
}

function saveInStore() {
    SE_API.store.set(storeKey, storeSavedValues);
}

function handleGoalReached(reachedValue) {
    if (goalFinishedSound) {
        goalFinishedSound.play();
    }
    overflow = reachedValue - goal;
    storeSavedValues = {
        ...storeSavedValues,
        lastGoalOverflow: overflow,
    };
    saveInStore();
}

function handleManualInput(inputToAdd) {
    if (inputToAdd === 0) {
        return;
    }
    if (!storeSavedValues.manualInput) {
        storeSavedValues.manualInput = 0;
    }
    storeSavedValues = {
        ...storeSavedValues,
        manualInput: storeSavedValues.manualInput + inputToAdd,
    };
    saveInStore();
}

function handleApplyOverflow() {
    if (storeSavedValues.lastGoalOverflow === 0) {
        return;
    }
    if (!storeSavedValues.manualInput) {
        storeSavedValues.manualInput = 0;
    }
    storeSavedValues = {
        ...storeSavedValues,
        manualInput: storeSavedValues.manualInput + storeSavedValues.lastGoalOverflow,
    };
    saveInStore();
}

function handleResetManualInput() {
    if (storeSavedValues.manualInput === 0) {
        return;
    }
    storeSavedValues = {
        ...storeSavedValues,
        manualInput: 0,
    };
    saveInStore();
}

function handleRemoveOverflow() {
    if (storeSavedValues.lastGoalOverflow === 0) {
        return;
    }
    storeSavedValues = {
        ...storeSavedValues,
        lastGoalOverflow: 0,
    };
    saveInStore();
}

function handleManualButtons(event) {
    if (event.listener === 'widget-button') {
        if (event.field === 'manualButton') {
            handleManualInput(+manualInput);
            updateDisplay();
        } else if (event.field === 'manualOverflowButton') {
            handleApplyOverflow();
            updateDisplay();
        } else if (event.field === 'resetManualInputButton') {
            handleResetManualInput();
            updateDisplay();
        } else if (event.field === 'manualClearOverflowButton') {
            handleRemoveOverflow();
            updateDisplay();
        } else if (obj.detail.event.field === 'manualClearStoreButton') {
            storeSavedValues = {
                lastGoalOverflow: 0,
                manualInput: 0,
            };
            saveInStore();
            updateDisplay();
        }
    }
}

function handleChatCommands(event) {
    const { text, nick, tags, channel } = event.data;
    const userstate = {
        mod: parseInt(tags.mod),
        sub: parseInt(tags.subscriber),
        vip: tags.badges.indexOf('vip') !== -1,
        badges: {
            broadcaster: nick === channel,
        },
    };
    // filter out messages from users not allowed to manipulate the goal
    if (
        !(
            (userstate.mod && fieldData['managePermissions'] === 'mods') ||
            userstate.badges.broadcaster ||
            fieldData.additionalUsers.includes(nick.toLowerCase())
        ) ||
        text === ''
    ) {
        return;
    }
    if (text === chatCommands.hideMTGCounter) {
        hideCounter = !hideCounter;
        updateDisplay();
    } else if (text.startsWith(chatCommands.manualInput)) {
        const messageInputValue = text.split(' ')[1];
        if (!isNaN(messageInputValue)) {
            handleManualInput(+messageInputValue);
        }
    } else if (text === chatCommands.resetManualInput) {
        handleResetManualInput();
        updateDisplay();
    } else if (text === chatCommands.manualApplyOverflow) {
        handleApplyOverflow();
        updateDisplay();
    } else if (text === chatCommands.manualClearOverflow) {
        handleRemoveOverflow();
        updateDisplay();
    }
}
