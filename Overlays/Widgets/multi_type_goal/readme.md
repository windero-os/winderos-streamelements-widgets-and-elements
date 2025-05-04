# Readme

This StreamElements widget is a multi type goal counter. That will save any overflow of the last finished goal so that it can be applyed to the next goal.

At the moment the following types of goals can be combined with this widget:

1. Tips
2. Twitch BITS (limited)
3. Youtube Superchats
4. Twitch subscriptions (limited)
5. Youtube memberships (limited)

They can be activated in the settings under the corresponding group.

This Widget uses the data from the session settings to count the tips, superchats, subscriptions and cheers. So if something does not count to those values in the session settings it will not be included in the counter. At the same time everything that counts to one of these goals will be counted the same way as any other contribution from that goal group not considering what the real value of that contribution was.

The forced split in overlays between Youtube and Twitch mean the count between the platforms is not working as far as I have seen.

## Setting information

### Goal settings

A goal can be displayed in two ways.

1. current / goal
2. remaining

Both options can display also a percentage value. For format 1 it is the fullfilment percentage so 10% you reached 10% of the goal. For format 2 it is the remaining percentage. So here 10% would mean, that 10% of the goal remain.

If you want to hide the goal but not delete the widget from the overlay. you can activate the "Hide the goal" option.

The leading image is a small image in front of the row.

Last you can add here options for when the goal is reached.

1. Play a sound when the goal is reached (Optional)
2. Change the background color of the goal line

### Manual management

In this setting group you can do a few manual changes to the goal counter.

1. Apply manual input: You can add the value selected before this setting to add manual input, e.g. if you got a donation from another source that is not adding to the settings. These inputs stack and are saved in the SE_API.store und the key multi_type_goal_store.
2. Apply overflow: Add the overflow of the last goal as a manual input. (The overflow can
   be applied multiple times so be careful)
3. Reset all manual input: Removes all manual added values from the goal
4. Remove saved overflow: Removes the saved overflow value from the SE_API.store
5. Reset the saved data for widget: Resets the SE_API.store key to only hold the values
   of the active version. Also resets all values to 0

### Chat command settings

In this setting group we have the chat commands that can be used to instead of the manual managment buttons. These chat commands can be individualized but should never contain a space as part of the command since the space is used to split the command from the value.

Also an command for a quick hide option is given. This will be overwritten when you change something in the widget settings, since it will only be saved in the active widget.

In case of the manual input add the value that should be added after the command separated by one space.

Also there is the option to allow other people to execute the commands.
Here you can either change it to allow also mods or you can add a comma sepearated list of the usernames that should be able to do it.

### Typography

Set the font family, size and colors of the displayed text.

### BITs

For cheers there is the option to set the BIT value with which they should be converted to your currency.

Limited:
At the moment only cheers are counted if I understand the settings correctly.
For a future update I will look into adding an option for counting redeemed BITs that were used with e.G. Tangia also. (with the reduced value from the 80/20 split included)

### Subs

Limited:
With subs is at the moment the problem, that I did not find an easy way to get the value of each subscription since the prices for a subscription depends on a regional price of the user and an discount if you gift more than 5 subs. (This will be a point I will look into for a future update of the widget).
At the moment there are settings for your split of subs and with what buy value you want the subs to be calculated for the goal. (The default is the price for one sub in the USA.)

### Memberships

Limited:
With memberships is at the moment the problem, that I did not find an easy way to get the value of each memberships since the prices for a memberships depends on a regional price of the user. (This will be a point I will look into for a future update of the widget).
At the moment there are settings for your split of memberships and with what buy value you want the memberships to be calculated for the goal.

### Donations

Tips counts what is under the "Tip goal progress" setting in the session settings

Superchats get their value reduced by the 70/30 split between the you and youtube.
