using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace PreprocessingData
{

    public class Node
    {
        public string source{set;get;}
        public string target{set;get;}
    }

    public class City
    {
        public double lon{get;set;}
        public double lat { get; set; }
        public string countryName { get; set; }
    }

    class PreprocessingData
    {

        static void subMain(string[] args)
        {
            //string ROOT_DIR = "D:\\Data\\";
            //StreamReader sr;
            //string inputDir = ROOT_DIR + "\\EbolaSortByTime";
            //string outputFile = ROOT_DIR + "EbolaFullYearCase";
            //StreamWriter sw = new StreamWriter(outputFile);

            //DirectoryInfo targetDir = new DirectoryInfo(inputDir);
            //FileInfo[] fileList = targetDir.GetFiles();
            //foreach (FileInfo file in fileList)
            //{
            //    sr = new StreamReader(file.FullName);
            //    while (!sr.EndOfStream)
            //    {
            //        sw.WriteLine(sr.ReadLine());
            //    }
            //    sw.Flush();
            //    sr.Close();
            //}
            //sw.Flush();
            //sw.Close();

            string ROOT_DIR = "D:\\Data\\";
            string inputFile = ROOT_DIR + "FIFAShortAttributes";
            Random rnd = new Random();
            List<string> file = File.ReadLines(inputFile).ToList();
            int count = 0;
            foreach (string line in file)
            {
                ++count;
            }
            Console.WriteLine(count);
            Console.ReadLine();

            //AddTheCountryName();
        }

        public void CombineCountriesFiles()
        {
            string ROOT_DIR = "D:\\Data\\";
            StreamReader sr;
            string countryName2Abr = ROOT_DIR + "country_latlon.csv";
            Dictionary<string, string> c2a = new Dictionary<string, string>();
            sr = new StreamReader(countryName2Abr);
            sr.ReadLine();
            while (!sr.EndOfStream)
            {
                string[] line = sr.ReadLine().Split(',');
                c2a.Add(line[6], line[0]);
            }
            sr.Close();

            string inputDir = ROOT_DIR + "\\Country_Ebola";
            string outputFile = ROOT_DIR + "EbolawithCountryName";
            StreamWriter sw = new StreamWriter(outputFile);

            DirectoryInfo targetDir = new DirectoryInfo(inputDir);
            FileInfo[] fileList = targetDir.GetFiles();
            foreach (FileInfo file in fileList)
            {
                string countryName = file.Name.Substring(0, file.Name.LastIndexOf('.'));
                sr = new StreamReader(file.FullName);
                if (c2a.ContainsKey(countryName))
                {
                    while (!sr.EndOfStream)
                    {
                        sw.WriteLine(sr.ReadLine() + "\t" + c2a[countryName]);
                    }
                    sw.Flush();
                }
                sr.Close();
            }
            sw.Flush();
            sw.Close();
        }

        public void CombineHoursFiles()
        {
            string ROOT_DIR = "D:\\Data\\";
            string[] inputFiles = new string[] { ROOT_DIR + "2014070904", ROOT_DIR + "2014070905", ROOT_DIR + "2014070906" };
            string outputFiles = ROOT_DIR + "FIFACASE";
            StreamWriter sw = new StreamWriter(outputFiles);
            for (int i = 0; i < inputFiles.Length; ++i)
            {
                foreach (string line in File.ReadLines(inputFiles[i]))
                {
                    sw.WriteLine(line);
                }
            }
            sw.Flush();
            sw.Close();
        
        }

        public void SplitOneDayTo24Hous()
        {
            string ROOT_DIR = "D:\\Data\\";
            string inputFile = ROOT_DIR + "20140709soted";
            string output_dir = ROOT_DIR + "20140709\\";
            StreamReader sr = new StreamReader(inputFile);
            Dictionary<string, StreamWriter> sws = new Dictionary<string, StreamWriter>();
            StreamWriter sw;
            var lines = File.ReadLines(inputFile);
            foreach (string currentLine in lines)
            {
                string[] tweetsAttribute = currentLine.Split('\t');
                DateTime date = DateTime.Parse(tweetsAttribute[4]);
                string fileName = date.ToString("yyyyMMddHH");
                if (File.Exists(output_dir + fileName))
                {
                    sw = sws[output_dir + fileName];
                }
                else
                {
                    sw = new StreamWriter(output_dir + fileName, true);
                    sws.Add(output_dir + fileName, sw);
                }
                sw.WriteLine(currentLine);
                sw.Flush();
            }

            foreach (KeyValuePair<string, StreamWriter> sw1 in sws)
            {
                sw1.Value.Close();
            }
            
        }

        public void SortTweetsInOneDay()
        {
            string ROOT_DIR = "D:\\Data\\";
            string inputFile = ROOT_DIR + "20140709";
            string outputFile = inputFile + "soted";
            StreamReader sr = new StreamReader(inputFile);
            //0tweetId \t 1userName \t 2userId \t 3tweetContent \t 4tweetDate \t 5userHomepage \t 6tweetsCount \t 7following 
            //\t 8follower \9 13V \t 10gpsA \t 11gpsB
            SortedDictionary<DateTime, List<string>> sortedTweets = new SortedDictionary<DateTime, List<string>>();
            StreamWriter sw = new StreamWriter(outputFile);
            foreach (string currentLine in File.ReadLines(inputFile))
            {
                string[] tweetsAttribute = currentLine.Split('\t');
                DateTime date = DateTime.Parse(tweetsAttribute[4]);
                if (!sortedTweets.ContainsKey(date))
                {
                    sortedTweets.Add(date, new List<string>());
                }
                sortedTweets[date].Add(currentLine);
            }

            foreach (KeyValuePair<DateTime, List<string>> item in sortedTweets)
            {
                List<string> tweets = item.Value;
                for (int i = 0, len = tweets.Count; i < len; ++i)
                {
                    sw.WriteLine(tweets[i]);
                }
            }
            sw.Flush();
            sw.Close();
        
        }

        public void SortByTime()
        {
            string ROOT_DIR = "D:\\Data\\";
            string inputFile = ROOT_DIR + "FIFAShortAttributes";
            string output_dir = ROOT_DIR + "\\SortByTime\\";
            //0tweetId \t 1userName \t 2userId \t 3tweetContent \t 4tweetDate \t 5userHomepage \t 6tweetsCount \t 7following 
            //\t 8follower \9 13V \t 10gpsA \t 11gpsB
            Dictionary<string, StreamWriter> sws = new Dictionary<string, StreamWriter>();
            StreamWriter sw;

            var lines = File.ReadLines(inputFile);
            foreach (string currentLine in lines)
            {
                string[] tweetsAttribute = currentLine.Split('\t');
                DateTime date = DateTime.Parse(tweetsAttribute[4]);
                string fileName = date.ToString("yyyyMMdd");
                if (File.Exists(output_dir + fileName))
                {
                    sw = sws[output_dir + fileName];
                }
                else
                {
                    sw = new StreamWriter(output_dir + fileName, true);
                    sws.Add(output_dir + fileName, sw);
                }
                sw.WriteLine(currentLine);
                sw.Flush();
            }

            foreach (KeyValuePair<string, StreamWriter> sw1 in sws)
            {
                sw1.Value.Close();
            }
        }

        public static void AddTheCountryName()
        {
            List<City> cities1000 = new List<City>();
            string cities1000File = "C:\\Users\\xiaot_000\\Documents\\Visual Studio 2013\\Projects\\ManyLens\\ManyLens\\Frontend\\testData\\cities15000.txt";
            //StreamWriter sw = new StreamWriter(cities1000File + ".short");
            foreach (string line in File.ReadLines(cities1000File))
            {
                // /4lon or lat /5lon or lat /8country name
                string[] s = line.Split('\t');
                cities1000.Add(new City() { lon = double.Parse(s[4]), lat = double.Parse(s[5]), countryName = s[8] });
                //sw.WriteLine(s[4] + '\t' + s[5] + '\t' + s[8]);
            }
            //sw.Close();

            string ROOT_DIR = "D:\\Data\\";
            string inputFile = ROOT_DIR + "FIFACASESample";
            string outputFile = inputFile + "withCountry";
            StreamWriter sw = new StreamWriter(outputFile);
            //0tweetId \t 1userName \t 2userId \t 3tweetContent \t 4tweetDate \t 5userHomepage \t 6tweetsCount \t 7following 
            //\t 8follower \9 13V \t 10gpsA \t 11gpsB
            int br = 0;
            int total = 0;
            foreach (string currentLine in File.ReadLines(inputFile))
            {
                string[] tweetsAttribute = currentLine.Split('\t');
                double a = double.Parse(tweetsAttribute[10]);
                double b = double.Parse(tweetsAttribute[11]);
                Object obj = new Object();
                double minDist = double.MaxValue;
                string countryName = "";
                Parallel.For(0, cities1000.Count, (i) =>
                {
                    double dx = a - cities1000[i].lon;
                    double dy = b - cities1000[i].lat;
                    dx = dx * dx;
                    dy = dy * dy;
                    lock (obj)
                    {
                        if (dx + dy < minDist)
                        {
                            minDist = dx + dy;
                            countryName = cities1000[i].countryName;
                        }
                    }
                });
                if (countryName == "BR")
                    br++;
                total++;
                sw.WriteLine(currentLine + "\t" + countryName);
            }
            sw.WriteLine(br + "\t" + total);
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

        public static void FilterTheAttribute(string clearFile)
        {
            string sampleFile =  clearFile;
            StreamWriter sw = new StreamWriter(clearFile + "ShortAttributes");
            //0tweetId \t 1screenName \t 2userName \t 3userId \t 4tweetContent \t 5language \t 6tweetDate \t 7timestamp \t 8userHomepage \t 9tweetsCount \t 10following 
            //\t 11follower \t 12profile \t 13V \t 14registerDate \t 15unixeTime \t 16timezone \t 17timezoneName \t 18location \t 19gpsA \t 20gpsB \t 21locationtype \t 22countryName
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
                    '\t' + tweetsAttribute[20] +
                    '\t' + tweetsAttribute[22]);
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
