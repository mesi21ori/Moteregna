// lib/firebaseAdmin.ts
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      projectId: "moteregna-a44d2",
      privateKeyId: "2d8bef425c9ab8e9c780f13f25c58e12a8e9f6a0",
      privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCq6VPLzpWk2Dyl
247m90z6jqOiwC+Ham4RTGKcodZUYnIDSPH6TYcjHWG2rlFyz/XsdQRS5xvxpvoI
6Y3Q+PUYj5fVmW2xn8iMfTtlKFEYCV9GH33mnmjMTv/dXc1ovMeQTeieVR6qK9ni
NFJ+JSHHJfkfVNdyAZUMxyOuKJebjwWkqZi40lkSMH7zXJgm0HCN1UR1CX8TAAlD
TpBEFSIdzDCwW47tYs3Xglyv2PXRVY5diYcyT+FvRrcU8ebHEQS0GjY0qZRl00Mj
2iipulgdWqY33OMENMm229ZzOivypNX5cOqJsLzLkpLZuP4gbj+8tWwh1pbqZcaa
cJ7UAcmTAgMBAAECggEAP7xzu3V26NqbA181k3x2AJpg+7igAOf31AugWrkfrKhp
zD/PvYBb/QRgBDhNt3tGQsAAtMnq6dtTMy+l62BsRpSGEun8tljX+Uxacgbu9v/H
v+bOlMpOWqK7WFo61+xOn8nuDd3AacWgo3LPsKs4RYQruztwfNuKMhGxhKkuoJvB
E0VZVojhv/cxyOY40lswVjA/nPuGJSmZt5pc4tPc7bU4mCICOp/vCW+wGnYLDNly
gtfoOaOZekMeeH9bhznf65C7w0sCMTf6SRflaVKG9ZZFf6+rlmcphdpQ4ytMUMTv
Oa0R6nwSBPVFxBfzC1LNxPsv31S4E+C1mBAuL/BWQQKBgQDhfjGA3pLqpWlOj0Mg
XiVAxHFm8xE1ItHGMV+yN3SDuJrSE1GdVfyYG8NaqazXjiFI7V4I+JF0aMvC4dtf
KfhvXeNawCg0RYO1Omq3/uetbz+84sxQMX8QK+b+4nhg75O9pIRdK534shiMFc6Z
mH0KUWXufOZimCpbd3CvuEcppwKBgQDCCLzXn5EL9FoRIjwkUOF1fcyNAfqaNWZV
fif4TqbSgCcqBD/iYCeDJcND8yt5UdJRth13gW8fCFwGbe+whX4SDbkVvFUSvLy0
h/TcVW8yWKlAFWicJQ22Y8hxXAE7l7WsKg8J+nWu41nnU7w6xAwYmGIgb4LwcHl/
J/eSmFnGNQKBgHIyXJOtJK5c0vYMK6yqwScJ1XyTwLUuSxqaSqKQ3xsOVKnrSrvp
niDSfp7dq0EHI+gw/hyA9fkEUZ0CkPyi3sRXwhplknbWdZtEWGOSXnZBDwBzw5Eh
X/4qnbObsec1rZavSLF+s2QNnczkBltXFIwzKPIcovhvo5Pq61CyfKelAoGAPm9R
VJCju5UE5j5927Gq2oOALl9UpApKw3e0pNGqHFHgSETVyaHnFOwxyMuWUZNieaiA
EtQzTWkDM45scgCCcIy54aSYO08/6VdWEw/ql+ivjU9WOegyYV36QX+5ZdOLQbrG
3A8bjwrZAvaOutoaik9+Q7GeEIAgmCnkH+el+4ECgYEAv21cug3vvlZARmyaf/W/
ls2dghjucwy8OKS8DC6LH7OOuDzQSyJeBOVhKPOMyq9+WtBZF00vyuWnY74vdBZ7
jjZofoXDrC4vB83+X1DlEFuaNk2ywvKrpvWRHYOV5z9axXnBv+i6h2Sv7JFldPRJ
+I7Jx97BUHEFU/o+GzfP/OA=
-----END PRIVATE KEY-----`,
      clientEmail: "firebase-adminsdk-fbsvc@moteregna-a44d2.iam.gserviceaccount.com",
      clientId: "100040438321198845883",
      authUri: "https://accounts.google.com/o/oauth2/auth",
      tokenUri: "https://oauth2.googleapis.com/token",
      authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
      clientC509CertUrl: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40moteregna-a44d2.iam.gserviceaccount.com",
      universeDomain: "googleapis.com"
    } as admin.ServiceAccount),
  });
}

export default admin;
