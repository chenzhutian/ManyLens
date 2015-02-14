using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;


namespace PreprocessingData
{
    class Program
    {
        static void Main(string[] args)
        {
            string ROOT_DIR = "D:\\Data\\";
            string sampleFile = ROOT_DIR + "clearFIFA";
            StreamWriter sw = new StreamWriter(ROOT_DIR + "FIFAShortAttributes");
            //0tweetId \t 1screenName \t 2userName \t 3userId \t 4tweetContent \t 5language \t 6tweetDate \t 7timestamp \t 8userHomepage \t 9tweetsCount \t 10following 
            //\t 11follower \t 12profile \t 13V \t 14registerDate \t 15unixeTime \t 16timezone \t 17timezoneName \t 18location \t 19gpsA \t 20gpsB \t 21locationtype
            foreach (string currentLine in File.ReadLines(sampleFile))
            {
                string[] tweetsAttribute = currentLine.Split('\t');
                sw.WriteLine(tweetsAttribute[0] +
                    '\t' + tweetsAttribute[2] +
                    '\t' + tweetsAttribute[3] +
                    '\t' + tweetsAttribute[4] +
                    '\t' + tweetsAttribute[6] +
                    '\t' + tweetsAttribute[8] +
                    '\t' + tweetsAttribute[9] +
                    '\t' + tweetsAttribute[10] +
                    '\t' + tweetsAttribute[11] +
                    '\t' + tweetsAttribute[13] +
                    '\t' + tweetsAttribute[19] +
                    '\t' + tweetsAttribute[20]);
            }
            sw.Flush();
            sw.Close();

        }


        public void RandomSample(double threadshold = 0.01001)
        {
            string ROOT_DIR = "D:\\Data\\";
            string clearFile = ROOT_DIR + "clearFIFA";
            StreamWriter sw = new StreamWriter(ROOT_DIR + "FIFASample");
            Random rnd = new Random();
            foreach (string currentLine in File.ReadLines(clearFile))
            {
                if (rnd.NextDouble() < threadshold)
                {
                    sw.WriteLine(currentLine);
                }
            }
            sw.Flush();
            sw.Close();
        
        }

        public void RemoveDuplicate(string filePath)
        {
            string ROOT_DIR = "D:\\Data\\";
            string rawFIFAFile = ROOT_DIR + "FIFA_cleaned_with_location_info.txt";
            string[] files = new string[2]; 
            files[0] = ROOT_DIR + "clearFIFA"; 
            files[1] = ROOT_DIR + "redudantFIFA";
            TextWriter writer1 = File.CreateText(files[0]); 
            TextWriter writer2 = File.CreateText(files[1]);

            HashSet<string> previousIDs = new HashSet<string>();
            string currentID;
            
            foreach(string currentLine in File.ReadLines(rawFIFAFile))
            {
                currentID = currentLine.Split('\t')[0];
                if (previousIDs.Add(currentID))
                { 
                    writer1.WriteLine(currentLine); 
                } 
                else 
                { 
                    writer2.WriteLine(currentLine); 
                } 
            
            }
            writer1.Close(); 
            writer2.Close(); 
            writer1.Dispose(); 
            writer2.Dispose();
        }

    }
}
