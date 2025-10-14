# Add trainPACIncrement function to fix NameError
def trainPACIncrement(algorithm, algorithm_name, XX, YY, initial, weights, intercept, classes):
    X_train, X_test, y_train, y_test = train_test_split(XX, YY, test_size = 0.2)
    start = timeit.default_timer()
    if initial == False:
        algorithm.coef_ = weights
        algorithm.intercept_ = intercept
        algorithm.classes_ = classes
    algorithm.partial_fit(X_train, y_train, np.unique(YY))
    predict = algorithm.predict(X_test)
    acc = accuracy_score(y_test, predict)
    print(acc)
    weights = algorithm.coef_
    intercept = algorithm.intercept_
    classes_details = algorithm.classes_
    end = timeit.default_timer()
    print((end - start))
    return weights, intercept, classes_details
#import required classes and packages
import pandas as pd #pandas to read and explore dataset
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE
from sklearn.linear_model import PassiveAggressiveClassifier
from sklearn.metrics import accuracy_score
from sklearn.linear_model import SGDClassifier
import timeit
from sklearn.linear_model import Perceptron
from sklearn.naive_bayes import BernoulliNB
from sklearn.naive_bayes import MultinomialNB

dataset = pd.read_csv("Dataset/data.csv")
dataset.drop(['isFlaggedFraud'], axis = 1,inplace=True)

label_encoder = []
columns = dataset.columns
types = dataset.dtypes.values
for j in range(len(types)):
    name = types[j]
    if name == 'object': #finding column with object type
        le = LabelEncoder()
        dataset[columns[j]] = pd.Series(le.fit_transform(dataset[columns[j]].astype(str)))#encode all str columns to numeric
        label_encoder.append([columns[j], le])
Y = dataset['isFraud'].ravel()
print(Y)
dataset.drop(['isFraud'], axis = 1,inplace=True)
dataset.fillna(dataset.mean(), inplace = True)
X = dataset.values
indices = np.arange(X.shape[0])
np.random.shuffle(indices) #shuffle dataset
X = X[indices]
Y = Y[indices]

scaler = StandardScaler()
X = scaler.fit_transform(X)

smote = SMOTE()
X, Y = smote.fit_resample(X, Y)

diff_1_X = X[0:10000]
diff_1_Y = Y[0:10000]

diff_2_X = X[10000:X.shape[0]]
diff_2_Y = Y[10000:X.shape[0]]

def trainIncrement(algorithm, algorithm_name, XX, YY, initial, weights, intercept, classes):
    X_train, X_test, y_train, y_test = train_test_split(XX, YY, test_size = 0.2)
    # Fix for MultinomialNB: ensure non-negative input
    if isinstance(algorithm, MultinomialNB):
        X_train = np.clip(X_train, 0, None)
        X_test = np.clip(X_test, 0, None)
    start = timeit.default_timer()
    if initial == False:
        algorithm.coef_ = weights
        algorithm.intercept_ = intercept
        algorithm.classes_ = classes
    algorithm.partial_fit(X_train, y_train, np.unique(YY))
    predict = algorithm.predict(X_test)
    acc = accuracy_score(y_test, predict)
    print(acc)
    weights = algorithm.coef_
    intercept = algorithm.intercept_
    classes_details = algorithm.classes_
    end = timeit.default_timer()
    print((end - start))
    return weights, intercept, classes_details
'''
pac = PassiveAggressiveClassifier(warm_start=True)
weights, intercept, classes_details = trainPACIncrement(pac, "PAC", diff_1_X, diff_1_Y, True, None, None, None)
weights, intercept, classes_details = trainPACIncrement(pac, "PAC", diff_2_X, diff_2_Y, False, weights, intercept, classes_details)

print()

sgd = SGDClassifier(warm_start=True)
weights, intercept, classes_details = trainPACIncrement(sgd, "SGD", diff_1_X, diff_1_Y, True, None, None, None)
weights, intercept, classes_details = trainPACIncrement(sgd, "SGD", diff_2_X, diff_2_Y, False, weights, intercept, classes_details)

perceptron = Perceptron(warm_start=True)
weights, intercept, classes_details = trainIncrement(perceptron, "Perceptron", diff_1_X, diff_1_Y, True, None, None, None)
weights, intercept, classes_details = trainIncrement(perceptron, "Perceptron", diff_2_X, diff_2_Y, False, weights, intercept, classes_details)

bnb = BernoulliNB()
weights, intercept, classes_details = trainIncrement(bnb, "BernoulliNB", diff_1_X, diff_1_Y, True, None, None, None)
weights, intercept, classes_details = trainIncrement(bnb, "BernoulliNB", diff_2_X, diff_2_Y, True, weights, intercept, classes_details)
'''

mnb = MultinomialNB()
weights, intercept, classes_details = trainIncrement(mnb, "MultinomialNB", diff_1_X, diff_1_Y, True, None, None, None)
weights, intercept, classes_details = trainIncrement(mnb, "MultinomialNB", diff_2_X, diff_2_Y, True, weights, intercept, classes_details)

sgd = SGDClassifier(warm_start=True)
weights, intercept, classes_details = trainPACIncrement(sgd, "SGD", diff_1_X, diff_1_Y, True, None, None, None)
weights, intercept, classes_details = trainPACIncrement(sgd, "SGD", diff_2_X, diff_2_Y, False, weights, intercept, classes_details)


