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
