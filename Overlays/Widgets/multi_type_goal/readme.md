# Readme

This StreamElements widget is a multi type goal counter. That will save any overflow of the last finished goal so that it can be applyed to the next goal.

At the moment the following types of goals can be combined with this widget:

1. Tips
2. Twitch BITS (limited)
3. Youtube Superchats
4. Twitch subscriptions (limited)

They can be activated in the settings under the corresponding group.

This Widget uses the data from the session settings to count the tips, superchats, subscriptions and cheers. So if something does not count to those values in the session settings it will not be included in the counter. At the same time everything that counts to one of these goals will be counted the same way as any other contribution from that goal group not considering what the real value of that contribution was.

## Setting information

### Manual management

In this setting group you can do a few manual changes to the goal counter.

1. Apply manual input: You can add the value selected before this setting to add manual input, e.g. if you got a donation from another source that is not adding to the settings. These inputs stack and are saved in the SE_API.store und the key multi_type_goal_store.
2. Apply overflow: Add the overflow of the last goal as a manual input. (The overflow can
   be applied multiple times so be careful)
3. Reset all manual input: Removes all manual added values from the goal
4. Remove saved overflow: Removes the saved overflow value from the SE_API.store
5. Reset the saved data for widget: Resets the SE_API.store key to only hold the values
   of the active version. Also resets all values to 0

### Typography

Set the font family, size and colors of the displayed text.

### Goal settings

A goal can be displayed in two ways.

1. current / goal
2. remaining

Both options can display also a percentage value. For format 1 it is the fullfilment percentage so 10% you reached 10% of the goal. For format 2 it is the remaining percentage. So here 10% would mean, that 10% of the goal remain.

The leading image is a small image in front of the row.

Last you can add here options for when the goal is reached.

1. Play a sound when the goal is reached (Optional)
2. Change the background color of the goal line

### BITs

For cheers there is the option to set the BIT value with which they should be converted to your currency.

Limited:
At the moment only cheers are counted if I understand the settings correctly.
For a future update I will look into adding an option for counting redeemed BITs that were used with e.G. Tangia also. (with the reduced value from the 80/20 split included)

### Subs

Limited:
With subs is at the moment the problem, that I did not find an easy way to get the value of each subscription since the prices for a subscription depends on a regional price of the user and an discount if you gift more than 5 subs. (This will be a point I will look into for a future update of the widget).
At the moment there are settings for your split of subs and with what buy value you want the subs to be calculated for the goal. (The default is the price for one sub in the USA.)

### Donations

Tips counts what is under the "Tip goal progress" setting in the session settings

Superchats get their value reduced by the 70/30 split between the you and youtube.
