#!/bin/bash
mkdir data
array=("baden-wuerttemberg" "bayern" "berlin" "brandenburg" "bremen" "hamburg" "hessen" "mecklenburg-vorpommern" "niedersachsen" "nordrhein-westfalen" "rheinland-pfalz" "saarland" "sachsen" "sachsen-anhalt" "schleswig-holstein" "thueringen")

token=DUoLAFPROZPxV84loeM0qpl4ZULeQK_8DGbM6OObfDjA7LL0gKRnEPjIAWq7xkiKc2OOAnLlAPcGpI7wIvZoQwz0E972XGNDDsSmZCvkWf8
prefix=https://www.schulferien.org/media/ical/deutschland/
suffix="?k=${token}"
for i in "${array[@]}"
do
   :
   echo "$i"
   file="feiertage_${i}_2022.ics"
   url="${prefix}${file}${suffix}"
   echo "Downloading ${url}"
   cd data && { curl "$url" -o "$file" -A "Mozilla/5.0 (X11; Linux x86_64; rv:94.0) Gecko/20100101 Firefox/94.0" ; cd -; }
done