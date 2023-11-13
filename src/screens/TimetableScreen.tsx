import React, { useEffect, useContext, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Provider, Divider, Text, Card } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { AuthContext } from '../utils/AuthProvider';


const TimetableScreen: React.FC = () => {
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [data, setData] = useState<Array<any>>([]);
    const { phpsessid } = useContext(AuthContext)

    const formatDateString = (date: Date | undefined) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const fetchTimetableDataWithAuth = async (start = '2023-10-29', end = '2023-10-30') => {
        try {
            if (phpsessid) {
                const postData = new URLSearchParams();
                postData.append('start', start);
                postData.append('end', end);
                const postResponse = await fetch('https://extranet.vizja.net/plan-zajec/pobierz-jednostki', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        Cookie: phpsessid,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: postData.toString(),
                });
                // Handle the post response as needed
                if (postResponse.ok) {
                    const responseData = await postResponse.json();
                    setData(responseData);
                } else {
                    console.log(postResponse.status)
                };
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                let start, end;
                if (startDate && endDate) {
                    start = formatDateString(new Date(startDate));
                    end = formatDateString(new Date(endDate));
                } else {
                    start = formatDateString(new Date());
                    setStartDate(new Date())
                    end = formatDateString(new Date(Date.now() + 2 * 7 * 24 * 60 * 60 * 1000));
                    setEndDate(new Date(Date.now() + 2 * 7 * 24 * 60 * 60 * 1000))
                }

                await fetchTimetableDataWithAuth(start, end);
            } catch (error) {
                console.error('Error fetching timetable data:', error);
            }
        };
        fetchData();
    }, []);
    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.pickerContainer}>
                    <DatePickerInput
                        style={{ height: 47 }}
                        locale="en-GB"
                        label="Start Date"
                        value={startDate}
                        onChange={(d) => setStartDate(d)}
                        inputMode="start"
                        presentationStyle='pageSheet'
                        animationType='fade'
                    />

                </View>
                <View style={styles.pickerContainer}>
                    <DatePickerInput
                        style={{ height: 47 }}
                        locale="en-GB"
                        label="End Date"
                        value={endDate}
                        onChange={(d) => setEndDate(d)}
                        inputMode="start"
                        presentationStyle='pageSheet'
                        animationType='fade'
                    />
                </View>
                <Button style={{ marginTop: 5 }} mode="contained" onPress={() => fetchTimetableDataWithAuth(formatDateString(startDate), formatDateString(endDate))}>Check</Button>
            </View>
            <Divider bold={true} />
            <ScrollView>
                {data &&
                    Object.entries(
                        data.reduce<{ [key: string]: any[] }>((acc, item) => {
                            const date = item.start.split(' ')[0];
                            if (!acc[date]) acc[date] = [];
                            acc[date].push(item);
                            return acc;
                        }, {})
                    ).sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime()).
                    map(([date, items], index) => (
                        <View key={`${date}-${index}`}>
                            <Card style={{ margin: 15 }}>
                                <Card.Title title={date} subtitle='' />
                                <Card.Content>
                                    {items.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map((item: any, innerIndex) => (
                                        <React.Fragment key={`${date}-${index}-${innerIndex}`}>
                                            <View style={{ marginTop: 15, marginBottom: 15 }}>
                                                <Text>{new Date(item.start).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}-{new Date(item.end).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</Text>
                                                <Text>{item.title}</Text>
                                            </View>
                                            <Divider bold={true} />
                                        </React.Fragment>
                                    ))}
                                </Card.Content>
                            </Card>
                        </View>
                    ))}
            </ScrollView>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    pickerContainer: {
        width: '100%',
        marginVertical: 25,
    },
    picker: {
        width: '100%',
    },
});

export default TimetableScreen;