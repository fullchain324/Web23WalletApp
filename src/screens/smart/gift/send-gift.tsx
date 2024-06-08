import React, {useState, useContext} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {useToast} from 'react-native-toast-notifications';

import {Screen} from 'layouts';

import {
  Web23Input,
  Web23Avatar,
  Web23Popup,
  Web23Button,
  ScreenTitle,
} from 'components';

import {useWeb23Navigation} from 'navigation';

import {SettingContext} from 'utils/context';
import getSelectedUser from 'utils/getSelectedUser';
import tw from 'utils/tailwind';

import SMHBarSVG from '../../../assets/icons/sm_hbar.svg';
import ClearSVG from '../../../assets/icons/clear.svg';
import CircleCheckSVG from '../../../assets/icons/check_circle.svg';
import MDHBarSVG from '../../../assets/icons/md_hbar.svg';
import LgHBarSVG from '../../../assets/icons/lg_hbar.svg';
import EditSVG from '../../../assets/icons/edit.svg';
import CheckCircleSVG from '../../../assets/icons/check_circle.svg';

const PASTE = 0;
const COPY = 1;
const CLEAR = 2;

const SendGiftScreen: React.FC<{route: any}> = ({route}) => {
  const {name = '', value = 0, amount = 0, tokenId = ''} = route.params;
  const navigation = useWeb23Navigation();
  const [searchKey, setSearchKey] = useState<string>('');
  const [copyState, setCopyState] = useState<number>(PASTE);
  const {settings, saveSettings} = useContext(SettingContext);
  const currentUser = getSelectedUser(settings.userData, settings.selectedUser);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [walletName, setWalletName] = useState<string>('New Contact');
  const [savedWalletType, setSavedWalletType] = useState<boolean>(false);
  const toast = useToast();

  return (
    <>
      <Screen>
        <ScreenTitle
          title="Gift tokens"
          onPress={() =>
            navigation.navigate('GiftTokenScreen', {
              name,
              value,
              amount,
              tokenId,
            })
          }
        />
        <View style={tw`relative my-4`}>
          <Web23Input
            placeholder="Search by name or address"
            value={searchKey}
            onChange={e => {
              setSearchKey(e);
              if ((e as string).length > 0) setCopyState(CLEAR);
              else setCopyState(PASTE);
            }}
          />
          <Text
            style={tw`absolute text-sm font-medium text-lime-500 active:font-bold top-4 right-5`}
            onPress={async () => {
              // switch (copyState) {
              //   case COPY:
              //     setShowEdit(true);
              //     break;
              //   case PASTE:
              //     const value = await navigator.clipboard.readText();
              //     setSearchKey(value);
              //     if (
              //       currentUser.contacts.findIndex(
              //         item => item.accountId === value,
              //       ) === -1
              //     )
              //       setCopyState(COPY);
              //     else setCopyState(CLEAR);
              //     toast.show(t('Pasted Sending Address') || '');
              //     break;
              //   case CLEAR:
              //     setSearchKey('');
              //     setCopyState(PASTE);
              //     break;
              //   default:
              //     break;
              // }
            }}>
            {copyState === COPY ? (
              'SAVE'
            ) : copyState === PASTE ? (
              'PASTE'
            ) : (
              <ClearSVG />
            )}
          </Text>
        </View>
        <View style={tw`mb-4 bg-grey-900 rounded-xl max-h-[252px]  `}>
          <h3
            style={tw`text-sm font-bold text-grey-200 pt-[18px] pb-[2px] px-3`}>
            My wallets
          </h3>
          {settings.userData.map((item, index) => (
            <View key={`${index}_${item.accountId}`}>
              <TouchableOpacity
                style={tw.style(
                  'px-3 py-[10px] flex items-center justify-between active:bg-grey-800',
                  index === settings.userData.length - 1 && 'rounded-b-xl',
                )}
                onPress={() => {
                  saveSettings({...settings, selectedUser: item.accountId});
                }}>
                <View style={tw`flex items-center gap-3`}>
                  <View style={tw`relative`}>
                    <Web23Avatar
                      type={item.type}
                      name={item.userName}
                      color={item.themeColor}
                    />
                    <SMHBarSVG
                      style={tw`absolute right-0 translate-y-1/2 translate-x-1/4 bottom-1`}
                    />
                  </View>
                  <View style={tw`py-1 font-bold`}>
                    <Text style={tw`text-base text-grey-50 mb-[2px]`}>
                      {item.userName}
                    </Text>
                    <Text style={tw`text-xs text-grey-400`}>
                      {item.accountId}
                    </Text>
                  </View>
                </View>
                {currentUser.accountId === item.accountId && (
                  <CircleCheckSVG fill="#D7FC51" />
                )}
              </TouchableOpacity>
              {index !== settings.userData.length - 1 && (
                <View style={tw`border-grey-800 w-full h-[1px]`} />
              )}
            </View>
          ))}
        </View>
        <View style={tw`mb-8 bg-grey-900 rounded-xl`}>
          <Text style={tw`px-3 pt-4 pb-2 text-sm font-bold text-grey-200`}>
            {searchKey.length > 0
              ? `Search results in wallets for "${searchKey}"`
              : 'Contacts'}
          </Text>
          {searchKey.length === 0 ||
          currentUser.contacts.filter(
            item =>
              item.accountId.includes(searchKey) ||
              item.userName.toLowerCase().includes(searchKey.toLowerCase()),
          ).length > 0 ? (
            <View style={tw`px-6 pt-2 pb-4 -cols-3`}>
              {currentUser?.contacts
                ?.filter(
                  contact =>
                    searchKey === '' ||
                    contact.accountId.includes(searchKey) ||
                    contact.userName
                      .toLowerCase()
                      .includes(searchKey.toLowerCase()),
                )
                .map(
                  item =>
                    item.accountId !== '' && (
                      <TouchableOpacity
                        key={item.accountId}
                        style={tw`py-2 border border-transparent hover:bg-grey-800 hover:border-grey-50 active:bg-grey-800 active:border-grey-50 rounded-xl`}
                        onPress={() =>
                          navigation.navigate('GiftSendDetailScreen', {
                            accountId: item.accountId,
                            userName: item.userName,
                            type: item.type,
                            name,
                            value,
                            amount,
                            tokenId,
                          })
                        }>
                        <View style={tw`relative flex justify-center`}>
                          <Web23Avatar
                            color="red"
                            name={item.userName}
                            type={item.type}
                            size="md"
                          />
                          <View
                            style={tw`absolute right-0 translate-y-1/4 translate-x-1/5 bottom-1`}>
                            <MDHBarSVG />
                          </View>
                        </View>

                        <Text
                          style={tw`mt-3 mb-[2px] font-bold text-sm text-grey-50 text-center w-full overflow-hidden truncate`}>
                          {item.userName}
                        </Text>
                        <Text
                          style={tw`text-xs font-medium text-center text-grey-400`}>
                          {item.accountId}
                        </Text>
                      </TouchableOpacity>
                    ),
                )}
            </View>
          ) : (
            <TouchableOpacity
              style={tw`px-3 py-[10px] rounded-b-xl flex items-center justify-between active:bg-grey-800`}
              onPress={() =>
                navigation.navigate('GiftSendDetailScreen', {
                  accountId: searchKey,
                  userName: 'Unknown',
                  type: 'initial',
                  name,
                  value,
                  amount,
                  tokenId,
                })
              }>
              <View style={tw`flex items-center gap-3`}>
                <LgHBarSVG />
                <View style={tw`py-1`}>
                  <Text style={tw`text-base font-bold text-grey-50`}>
                    {searchKey}
                  </Text>
                  <Text style={tw`text-xs font-bold text-grey-400`}>
                    Hedera chain
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={e => {
                  e.stopPropagation();
                  setShowEdit(true);
                }}>
                <EditSVG fill="#9E9E9E" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        </View>
      </Screen>
      <Web23Popup show={showEdit} setShow={setShowEdit} title="Save Contact">
        <View style={tw`px-3 pt-4 pb-[14px] bg-grey-900 rounded-xl mb-4`}>
          <View style={tw`flex justify-center mb-4`}>
            <Web23Avatar
              name={walletName}
              color="red"
              size="lg"
              type={!savedWalletType ? 'initial' : 'icon'}
            />
          </View>
          <Web23Input
            placeholder="Enter name"
            limit={32}
            value={walletName}
            onChange={e => {
              if (e.length > 31) setWalletName(e.slice(0, 32));
              else setWalletName(e);
            }}
          />
        </View>
        <View
          style={tw`bg-grey-900 px-3 py-[10px] rounded-xl flex justify-between items-center mb-4`}>
          <View style={tw`flex items-center gap-3`}>
            <LgHBarSVG />
            <View style={tw`py-1`}>
              <Text style={tw`text-base font-bold text-grey-50 mb-[2px]`}>
                Hedera
              </Text>
              <Text style={tw`text-xs font-bold text-grey-400`}>
                {searchKey}
              </Text>
            </View>
          </View>
          <CheckCircleSVG fill="#D7FC51" />
        </View>
        <View style={tw`mb-8 bg-grey-900 rounded-xl`}>
          <Text
            style={tw`px-3 pt-[18px] pb-[2px] font-bold text-sm text-grey-200`}>
            Wallet Customization
          </Text>
          <View style={tw`flex flex-row justify-between px-6 py-[10px]`}>
            <TouchableOpacity
              style={tw.style(
                'flex items-center gap-2 px-2 py-1 border-2 rounded-xl border-transparent',
                !savedWalletType && 'border-lime-500',
              )}
              onPress={() => setSavedWalletType(false)}>
              <Web23Avatar name={walletName} color="red" type="initial" />
              <View style={tw`py-1`}>
                <Text style={tw`font-bold text-base text-grey-50 mb-[2px]`}>
                  Initial
                </Text>
                <Text style={tw`text-xs font-bold text-grey-400`}>
                  Character
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw.style(
                'flex items-center gap-2 px-2 py-1 border-2 rounded-xl border-transparent',
                savedWalletType && 'border-lime-500',
              )}
              onPress={() => setSavedWalletType(true)}>
              <Web23Avatar name={walletName} color="red" type="icon" />
              <View style={tw`py-1`}>
                <Text style={tw`font-bold text-base text-grey-50 mb-[2px]`}>
                  Icon
                </Text>
                <Text style={tw`text-xs font-bold text-grey-400`}>
                  Wallet Icon
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={tw`border-grey-800 w-full h-[1px]`} />
          <View style={tw`p-1`}>
            <Web23Button
              text="Save changes"
              onPress={() => {
                let newUser = settings.userData.map(item => {
                  if (item.accountId === currentUser.accountId) {
                    let contact = [
                      {
                        userName: walletName,
                        accountId: searchKey,
                        type: savedWalletType
                          ? 'icon'
                          : ('initial' as 'icon' | 'initial'),
                      },
                    ];
                    if (
                      item.contacts.length > 0 &&
                      item.contacts[0].accountId !== ''
                    ) {
                      contact = item.contacts.concat({
                        userName: walletName,
                        accountId: searchKey,
                        type: savedWalletType
                          ? 'icon'
                          : ('initial' as 'icon' | 'initial'),
                      });
                    }
                    return {...item, contacts: contact};
                  } else return {...item};
                });
                saveSettings({...settings, userData: newUser});
                setShowEdit(false);
                setSearchKey('');
                setCopyState(PASTE);
              }}
            />
          </View>
        </View>
      </Web23Popup>
    </>
  );
};

export default SendGiftScreen;
