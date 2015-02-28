using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Text.RegularExpressions;


namespace PreprocessingData
{

    public class Node
    {
        public string source{set;get;}
        public string target{set;get;}
    }

    class Program
    {

        static void Main(string[] args)
        {
            List<string[]> cities1000 = new List<string[]>();
            string cities1000File = "C:\\Users\\xiaot_000\\Documents\\Visual Studio 2013\\Projects\\ManyLens\\ManyLens\\Frontend\\testData\\cities1000.txt";
            foreach(string line in File.ReadLines(cities1000File))
            {
                // /4lon or lat /5lon or lat /8country name
                string[] s = line.Split('\t');
                cities1000.Add(new string[] { s[4],s[5],s[8]});
            }


            string ROOT_DIR = "D:\\Data\\";
            string inputFile = ROOT_DIR + "FIFAShortAttributes";
            string outputFile = inputFile + "withCountry";
            StreamWriter sw = new StreamWriter(outputFile);
            //0tweetId \t 1userName \t 2userId \t 3tweetContent \t 4tweetDate \t 5userHomepage \t 6tweetsCount \t 7following 
            //\t 8follower \9 13V \t 10gpsA \t 11gpsB
            foreach (string currentLine in File.ReadLines(inputFile))
            {
                string[] tweetsAttribute = currentLine.Split('\t');
                string a = tweetsAttribute[10];
                string b = tweetsAttribute[11];
                Object obj = new Object();
                double minDist = double.MaxValue;
                string countryName = "";
                Parallel.For(0, cities1000.Count, (i) => {
                    double dx = double.Parse(a) - double.Parse(cities1000[i][0]);
                    double dy = double.Parse(b) - double.Parse(cities1000[i][1]);
                    dx = dx * dx;
                    dy = dy * dy;
                    lock (obj) 
                    {
                        if (dx + dy < minDist)
                        {
                            minDist = dx + dy;
                            countryName = cities1000[i][2];
                        }
                    }
                });
                sw.WriteLine(currentLine + "\t" + countryName);
            }
            sw.Flush();
            sw.Close();

        }

        public void ExtractRetweetNetwork()
        {
            string ROOT_DIR = "D:\\Data\\";
            string sampleFile = ROOT_DIR + "FIFAShortAttributesSample";
            List<Node> nodes = new List<Node>();
            //0tweetId \t 1userName \t 2userId \t 3tweetContent \t 4tweetDate \t 5userHomepage \t 6tweetsCount \t 7following 
            //\t 8follower \9 13V \t 10gpsA \t 11gpsB

            Regex RTreg = new Regex(@"^[Rr][Tt] ?@(\w+\b)");
            foreach (string currentLine in File.ReadLines(sampleFile))
            {
                string[] tweetsAttribute = currentLine.Split('\t');
                string content = tweetsAttribute[3];
                string userName = tweetsAttribute[1];
                MatchCollection rts = RTreg.Matches(content);
                if (rts.Count > 1)
                {
                    throw new Exception("The number or RT is more than one!!");

                }

                else if (rts.Count == 1)
                {
                    string sourceUserName = rts[0].Groups[1].Value;
                    Node node = new Node()
                    {
                        source = sourceUserName,
                        target = userName
                    };
                    nodes.Add(node);
                }
            }

            StreamWriter sw = new StreamWriter(sampleFile +"Network");
            var jser = new System.Runtime.Serialization.Json.DataContractJsonSerializer(typeof(List<Node>));
            jser.WriteObject(sw.BaseStream, nodes);
            sw.Flush();
            sw.Close();
        }

        public void FilterTheAttribute(string clearFile)
        {
            string sampleFile =  clearFile;
            StreamWriter sw = new StreamWriter(clearFile + "ShortAttributes");
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

        public void RandomSample(string fileName,double threadshold = 0.01001)
        {
            string sampleFile = fileName;
            StreamWriter sw = new StreamWriter(fileName +"Sample");
            Random rnd = new Random();
            foreach (string currentLine in File.ReadLines(sampleFile))
            {
                if (rnd.NextDouble() < threadshold)
                {
                    sw.WriteLine(currentLine);
                }
            }
            sw.Flush();
            sw.Close();
        
        }

        public void RemoveDuplicate()
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
