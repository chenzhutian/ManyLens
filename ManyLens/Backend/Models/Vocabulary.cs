using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{
    public class Vocabulary
    {
        private Dictionary<string, int> idOfWords = null;
        private Dictionary<string, int> dfOfWords = null;
        private Dictionary<string, int> frequenceOfWords = null;



        #region Getter&Setter
        public Dictionary<string, int> IdOfWords
        {
            get
            {
                return this.idOfWords;
            }
            private set
            {
                this.idOfWords = value;
            }
        }
        public Dictionary<string, int> DfOfWords
        {
            get
            {
                return this.dfOfWords;
            }
            private set
            {
                this.dfOfWords = value;
            }
        }
        public Dictionary<string, int> FrequenceOfWords
        {
            get { return frequenceOfWords; }
            private set { frequenceOfWords = value; }
        }
        public int Dimension
        {
            get
            {
                if (idOfWords != null)
                    return idOfWords.Count;
                return -1;
            }
        }
        #endregion

        public Vocabulary(Dictionary<string, int> idOfWrods, Dictionary<string, int> dfOfWords,Dictionary<string,int> frequenceOfWords)
        {
            this.IdOfWords = idOfWrods;
            this.DfOfWords = dfOfWords;
            this.FrequenceOfWords = frequenceOfWords;
        }
        public int GetIDofWord(string word)
        {
            if (this.IdOfWords == null)
                return -1;
            return this.IdOfWords[word];
        }
        public int GetDFofWord(string word)
        {
            if (this.DfOfWords == null)
                return -1;
            return this.DfOfWords[word];
        }
    }
}