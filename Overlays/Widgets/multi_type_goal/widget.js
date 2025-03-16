let displayPercentage = false,
    showRemaining = false,
    displayGoalText = 'Goal',
    countCheers = true,
    countSub = true,
    subValue = 50,
    bitValue = 0.01,
    countTips = true,
    countSuperchats = false,
    displayGoalCurrency = '$',
    displayRemainingText = 'Remaining',
    goal = 0,
    useSubBuyValue = 0,
    manualInput = 0,
    displayStartingImg = '',
    sessionData = undefined,
    goalFinishedSound = undefined,
    goalChangeFinishedColor = true,
    storeSavedValues = {
        lastGoalOverflow: 0,
        manualInput: 0,
    };

const storeKey = 'multi_type_goal_store';

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.event.listener === 'widget-button') {
        if (obj.detail.event.field === 'manualButton') {
            handleManualInput();
            updateDisplay();
        } else if (obj.detail.event.field === 'manualOverflowButton') {
            handleApplyOverflow();
            updateDisplay();
        } else if (obj.detail.event.field === 'resetManualInputButton') {
            handleResetManualInput();
            updateDisplay();
        } else if (obj.detail.event.field === 'manualClearOverflowButton') {
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
});

window.addEventListener('onSessionUpdate', function (obj) {
    sessionData = obj['detail']['session'];
    console.log('Saved Values in ', storeKey, storeSavedValues);
    updateDisplay();
});

window.addEventListener('onWidgetLoad', async function (obj) {
    let storeValue;
    try {
        storeValue = await SE_API.store.get(storeKey);
    } catch (e) {}
    if (storeValue === undefined || storeValue === null) {
        SE_API.store.set(storeKey, storeSavedValues);
    } else {
        storeSavedValues = storeValue;
    }
    console.log('Saved Values in ', storeKey, storeSavedValues);
    const fieldData = obj.detail.fieldData;
    displayPercentage = fieldData.showPercentageOfFulfillment;
    showRemaining = fieldData.showRemainingValueInstead;
    displayGoalText = fieldData.displayGoalText;
    countCheers = fieldData.countCheers;
    bitValue = fieldData.bitValue;
    countSub = fieldData.countSub;
    subValue = fieldData.subValue;
    countTips = fieldData.countTips;
    countSuperchats = fieldData.countSuperchats;
    displayGoalCurrency = fieldData.displayGoalCurrency;
    displayRemainingText = fieldData.displayRemainingText;
    goal = fieldData.goal;
    useSubBuyValue = fieldData.useSubBuyValue;
    manualInput = fieldData.manualInput;
    goalChangeFinishedColor = fieldData.goalChangeFinishedColor;
    if (fieldData.goalFinishedSound) {
        goalFinishedSound = new Audio(fieldData.goalFinishedSound);
        goalFinishedSound.volume = fieldData.goalFinishedSoundVolume / 100;
    }
    displayStartingImg = fieldData.displayStartingImg;

    sessionData = obj['detail']['session']['data'];
    updateDisplay();
});

function calcReachedValue() {
    if (!storeSavedValues.manualInput) {
        storeSavedValues.manualInput = 0;
    }
    let reachedValue = storeSavedValues.manualInput;
    if (countTips) {
        reachedValue += sessionData['tip-goal']['amount'] || 0;
    }
    if (countSub) {
        reachedValue += +(sessionData['subscriber-goal']['amount'] * useSubBuyValue * (subValue / 100)).toFixed(2) || 0;
    }
    if (countCheers) {
        reachedValue += +(sessionData['cheer-goal']['amount'] * bitValue).toFixed(2) || 0;
    }
    if (countSuperchats) {
        reachedValue += +(sessionData['superchat-goal']['amount'] * 0.7).toFixed(2) || 0;
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

function updateDisplay() {
    const percentageDisplay = document.getElementById('percentage-display-outside');
    const remainingDisplay = document.getElementById('goal-remaining-display');
    const goalReachedDisplay = document.getElementById('goal-reached-display');
    const leadingImage = document.getElementById('leading-image');

    let displayedValue = calcReachedValue();
    if (showRemaining) {
        remainingDisplay.classList.remove('hidden');
        goalReachedDisplay.classList.add('hidden');
        displayedValue = Math.max(goal - displayedValue, 0);
        remainingDisplay.children[0].innerHTML = displayedValue + ' ' + displayGoalCurrency;
    } else {
        goalReachedDisplay.classList.remove('hidden');
        remainingDisplay.classList.add('hidden');
        goalReachedDisplay.children[0].innerHTML = displayedValue;
    }
    if (displayPercentage) {
        const percentage = +((displayedValue / goal) * 100).toFixed(2);
        percentageDisplay.classList.remove('hidden');
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
    console.log('Saved Values in ', storeKey, storeSavedValues);
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

function handleManualInput() {
    if (manualInput === 0) {
        return;
    }
    if (!storeSavedValues.manualInput) {
        storeSavedValues.manualInput = 0;
    }
    storeSavedValues = {
        ...storeSavedValues,
        manualInput: storeSavedValues.manualInput + manualInput,
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
