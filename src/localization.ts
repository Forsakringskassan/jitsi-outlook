// SPDX-FileCopyrightText: 2023 Havs- och vattenmyndigheten
// SPDX-FileCopyrightText: 2025 Försäkringskassan
//
// SPDX-License-Identifier: MIT

interface LocalizedStrings {
  connectToMeeting: string;
  linkToMeeting: string;
}

const getLocalizedStrings = (lang?: string): LocalizedStrings => {
  const myLanguage = lang ? lang : "en";
  if (/sv/.test(myLanguage)) {
    return {
      connectToMeeting: "Anslut till mötet",
      linkToMeeting: "Länk till mötet",
    };
  } else if (/de/.test(myLanguage)) {
    return {
      connectToMeeting: "Verbinden",
      linkToMeeting: "Link zum Treffen",
    };
  } else if (/nl/.test(myLanguage)) {
    return {
      connectToMeeting: "Verbinden met vergadering",
      linkToMeeting: "Link naar vergadering",
    };
  } else {
    // Default to english
    return {
      connectToMeeting: "Connect to meeting",
      linkToMeeting: "Link to meeting",
    };
  }
};

export default getLocalizedStrings;
