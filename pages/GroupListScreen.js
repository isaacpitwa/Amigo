import React, { useCallback, useState } from 'react';
import {
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    View,
    TextInput,
    Keyboard,
} from 'react-native';
import Loader from '../components/Loader';
import apiHelper from '../helper/apiHelper';
import PAGES from '../constants/pages';
import FabIcon from '../components/FabIcon';
import { useFocusEffect } from '@react-navigation/native';
import EmptyScreen from '../components/EmptyScreen';
import COLOR from '../constants/Colors';
import { calcHeight, calcWidth, getFontSizeByWindowWidth } from '../helper/res';
import GroupCard from '../components/GroupCard';
import NoGroupsImage from '../assets/NoGroups.png';
import Search from '../components/Search';
import editNamesAsync from '../helper/editNamesAsync';
import { useAuth } from '../context/AuthContext';
function GroupListScreen({ navigation }) {
    const [groups, setGroups] = useState();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const { user } = useAuth();

    useFocusEffect(
        useCallback(() => {
            (async () => {
                if (groups == []) setLoading(true);
                const { data } = await apiHelper('/group');
                for (let group of data)
                    group.members = await editNamesAsync(
                        group.members,
                        user._id,
                    );

                setGroups(data);
                setLoading(false);
            })();
        }, []),
    );

    const filterGroups = () =>
        search === ''
            ? groups
            : groups.filter((group) =>
                  group.name.toLowerCase().includes(search.toLowerCase()),
              );
    if(loading)
    return (
        <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Groups</Text>
            <>
                <View
                    style={{
                        alignItems: 'center',
                        marginTop: calcHeight(2),
                        marginBottom: calcHeight(4),
                    }}
                >
                    <Search search={search} setSearch={setSearch} loading />
                </View>
                <FlatList
                    data={[{},{},{}]}
                    renderItem={({ item }) => <GroupCard group={item} loading />}
                    onScroll={() => {
                        Keyboard.dismiss();
                    }}
                />
            </>
            <FabIcon
                onPress={() => {
                    {
                        navigation.navigate(PAGES.CREATE_GROUP);
                    }
                }}
                loading
            />
    </SafeAreaView>
);

    return  (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Groups</Text>
            {groups && groups.length == 0 ? (
                <EmptyScreen
                    onPress={() => {
                        navigation.navigate(PAGES.CREATE_GROUP);
                    }}
                    image={NoGroupsImage}
                    title="No Groups Yet"
                />
            ) : (
                <>
                    <View
                        style={{
                            alignItems: 'center',
                            marginTop: calcHeight(2),
                            marginBottom: calcHeight(4),
                        }}
                    >
                        <Search search={search} setSearch={setSearch} />
                    </View>
                    <FlatList
                        data={filterGroups(groups)}
                        renderItem={({ item }) => <GroupCard group={item} />}
                        keyExtractor={(item) => item.id} // Replace 'item.id' with the appropriate key property from your group objects
                        onScroll={() => {
                            Keyboard.dismiss();
                        }}
                    />
                </>
            )}
            {groups && groups.length != 0 && (
                <FabIcon
                    onPress={() => {
                        {
                            navigation.navigate(PAGES.CREATE_GROUP);
                        }
                    }}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.APP_BACKGROUND,
    },
    header: {
        fontSize: getFontSizeByWindowWidth(19),
        color: COLOR.TEXT,
        fontWeight: 'bold',
        margin: calcHeight(2),
    },
    groupName: {
        fontSize: 16,
        marginVertical: 5, // Add margin for better spacing
    },
    group: {
        flexDirection: 'row',
    },
});

export default GroupListScreen;
