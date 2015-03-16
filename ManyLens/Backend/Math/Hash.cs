using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Cryptography;
using Murmur;

namespace ManyLens.myMath
{
    public class Hash
    {
        private static HashAlgorithm hash = MurmurHash.Create32();

        public static int GetHashCode(string word)
        {
            byte[] bytes = hash.ComputeHash(System.Text.Encoding.Unicode.GetBytes(word));
            if (BitConverter.IsLittleEndian)
                Array.Reverse(bytes);

            return BitConverter.ToInt32(bytes, 0);
        }
    }
}